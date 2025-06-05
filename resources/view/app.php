<?php

$hotFile = __DIR__ . "/../../public/hot";
$manifestPath = __DIR__ . "/../../public/build/.vite/manifest.json";

$viteDevServer = null;
$entry = null;

if (file_exists($hotFile)) {
    $viteDevServer = trim(file_get_contents($hotFile));
    if (!filter_var($viteDevServer, FILTER_VALIDATE_URL)) {
        throw new RuntimeException("Invalid url in Hotfile");
    }
} elseif (file_exists($manifestPath)) {
    $manifest = json_decode(file_get_contents($manifestPath), true);
    $entry = $manifest["resources/js/app.tsx"] ?? null;

    if (!$entry || !isset($entry['file'])) {
        throw new RuntimeException("Broken manifest file");
    }
} else {
    throw new RuntimeException("Vite Server Not running! pls run `npm run dev` or `npm run build`");
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title inertia>Water Monitoring</title>

    <?php if ($viteDevServer): ?>
        <script type="module" src="<?= htmlspecialchars($viteDevServer) ?>/@vite/client"></script>
    <?php elseif (!empty($entry['css'])): ?>
        <?php foreach ($entry['css'] as $css): ?>
            <link rel="stylesheet" href="/build/<?= htmlspecialchars($css) ?>" />
        <?php endforeach; ?>
    <?php endif; ?>
</head>

<body>
    <div id="app" data-page='<?= $page ?>'></div>

    <?php if ($viteDevServer): ?>
        <script type="module" src="<?= htmlspecialchars($viteDevServer) ?>/resources/js/app.tsx"></script>

    <?php else: ?>
        <script type="module" src="/build/<?= htmlspecialchars($entry['file']) ?>"></script>
    <?php endif; ?>
</body>

</html>