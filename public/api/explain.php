<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function fail_request(int $status, string $code): void
{
    http_response_code($status);
    echo json_encode(['error' => $code], JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_profile(array $profile): array
{
    $allowed = [
        'name',
        'headline',
        'role',
        'location',
        'timezone',
        'remotePreference',
        'commitment',
        'startWindow',
        'offers',
        'seeks',
        'industries',
        'values',
        'workStyle',
        'fundingPreference',
        'bio',
    ];
    $clean = [];
    foreach ($allowed as $key) {
        if (array_key_exists($key, $profile)) {
            $clean[$key] = $profile[$key];
        }
    }
    return $clean;
}

function valid_string_list(mixed $value, int $minimum, int $maximum): bool
{
    if (!is_array($value) || count($value) < $minimum || count($value) > $maximum) {
        return false;
    }
    foreach ($value as $item) {
        if (!is_string($item) || trim($item) === '' || strlen($item) > 500) {
            return false;
        }
    }
    return true;
}

function valid_explanation(array $value): bool
{
    return isset($value['summary'], $value['strengths'], $value['friction'], $value['questions'])
        && is_string($value['summary'])
        && trim($value['summary']) !== ''
        && strlen($value['summary']) <= 700
        && valid_string_list($value['strengths'], 2, 3)
        && is_string($value['friction'])
        && trim($value['friction']) !== ''
        && strlen($value['friction']) <= 700
        && valid_string_list($value['questions'], 3, 3);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail_request(405, 'method_not_allowed');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 24576) {
    fail_request(413, 'request_too_large');
}

$raw = file_get_contents('php://input');
if (!is_string($raw) || $raw === '' || strlen($raw) > 24576) {
    fail_request(400, 'invalid_request');
}

try {
    $decoded = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    fail_request(400, 'invalid_json');
}

if (
    !is_array($decoded)
    || !isset($decoded['seeker'], $decoded['candidate'], $decoded['scores'])
    || !is_array($decoded['seeker'])
    || !is_array($decoded['candidate'])
    || !is_array($decoded['scores'])
) {
    fail_request(400, 'invalid_payload');
}

$apiKey = getenv('OPENAI_API_KEY');
if (!is_string($apiKey) || trim($apiKey) === '') {
    fail_request(503, 'ai_not_configured');
}

$input = [
    'seeker' => clean_profile($decoded['seeker']),
    'candidate' => clean_profile($decoded['candidate']),
    'scores' => array_intersect_key(
        $decoded['scores'],
        array_flip(['complementarity', 'values', 'goals', 'workStyle', 'logistics', 'overall'])
    ),
];

$schema = [
    'type' => 'object',
    'properties' => [
        'summary' => ['type' => 'string'],
        'strengths' => [
            'type' => 'array',
            'items' => ['type' => 'string'],
            'minItems' => 2,
            'maxItems' => 3,
        ],
        'friction' => ['type' => 'string'],
        'questions' => [
            'type' => 'array',
            'items' => ['type' => 'string'],
            'minItems' => 3,
            'maxItems' => 3,
        ],
    ],
    'required' => ['summary', 'strengths', 'friction', 'questions'],
    'additionalProperties' => false,
];

$request = [
    'model' => getenv('OPENAI_MODEL') ?: 'gpt-5.6',
    'input' => [
        [
            'role' => 'system',
            'content' => 'You explain possible cofounder compatibility. Use only the supplied profile fields and scores. Give specific evidence, one respectful friction point, and three practical first-conversation questions. Never infer demographics, personality diagnoses, or guaranteed outcomes.',
        ],
        [
            'role' => 'user',
            'content' => json_encode($input, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ],
    ],
    'text' => [
        'format' => [
            'type' => 'json_schema',
            'name' => 'founderpair_match_explanation',
            'schema' => $schema,
            'strict' => true,
        ],
    ],
    'max_output_tokens' => 900,
];

$ch = curl_init('https://api.openai.com/v1/responses');
if ($ch === false) {
    fail_request(503, 'ai_unavailable');
}

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 18,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($request, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
]);

$responseBody = curl_exec($ch);
$responseStatus = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if (!is_string($responseBody) || $responseStatus < 200 || $responseStatus >= 300) {
    fail_request(502, 'ai_unavailable');
}

try {
    $response = json_decode($responseBody, true, 128, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    fail_request(502, 'invalid_ai_response');
}

$outputText = null;
foreach (($response['output'] ?? []) as $output) {
    if (!is_array($output)) {
        continue;
    }
    foreach (($output['content'] ?? []) as $content) {
        if (
            is_array($content)
            && ($content['type'] ?? '') === 'output_text'
            && isset($content['text'])
            && is_string($content['text'])
        ) {
            $outputText = $content['text'];
            break 2;
        }
    }
}

if ($outputText === null) {
    fail_request(502, 'invalid_ai_response');
}

try {
    $explanation = json_decode($outputText, true, 32, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    fail_request(502, 'invalid_ai_response');
}

if (!is_array($explanation) || !valid_explanation($explanation)) {
    fail_request(502, 'invalid_ai_response');
}

echo json_encode($explanation, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
