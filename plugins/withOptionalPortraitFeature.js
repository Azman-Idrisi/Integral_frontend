const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Keep the app portrait-oriented without requiring portrait-capable hardware.
 * This expands Play Store device compatibility while preserving the app's UI orientation.
 */
function withOptionalPortraitFeature(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const features = manifest['uses-feature'] || [];
    const featureName = 'android.hardware.screen.portrait';

    const portraitFeature = features.find(
      (feature) => feature.$?.['android:name'] === featureName
    );

    if (portraitFeature) {
      portraitFeature.$['android:required'] = 'false';
    } else {
      features.push({
        $: {
          'android:name': featureName,
          'android:required': 'false',
        },
      });
    }

    manifest['uses-feature'] = features;
    return config;
  });
}

module.exports = withOptionalPortraitFeature;
