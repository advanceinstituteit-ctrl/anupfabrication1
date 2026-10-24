<?php
/**
 * Anup Fabrication - Single Page Application entry fallback for Apache / PHP hosts (InfinityFree)
 */
if (file_exists(__DIR__ . '/index.html')) {
    include_once(__DIR__ . '/index.html');
} else {
    echo "Website files loaded. Please make sure index.html is in the same directory.";
}
?>
