<?php
/**
 * Anup Fabrication - Single Page Application entry fallback for Apache / PHP hosts (InfinityFree)
 * Target Domain: anupfabrication.kesug.com
 */
header('Content-Type: text/html; charset=utf-8');

if (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
    exit;
} else {
    echo "<h2>Anup Fabrication</h2><p>Website files loaded. Please make sure <code>index.html</code> is present in this htdocs folder.</p>";
}
?>
