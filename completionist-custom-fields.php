<?php
/**
 * Plugin Name:       Completionist - Custom Fields
 * Description:       Displays custom fields on project tasks in the [ptc_asana_project] shortcode. Requires Completionist v3.11.0 or later.
 * Version:           0.1.0
 * Requires PHP:      7.2
 * Requires at least: 5.0.0
 * Tested up to:      6.4.1
 */

namespace Completionist_Custom_Fields;

defined( 'ABSPATH' ) || die();

// Register code.

add_action(
	'ptc_completionist_shortcode_enqueue_assets',
	__NAMESPACE__ . '\enqueue_shortcode_assets',
	10,
	1
);

add_filter(
	'ptc_completionist_project_task_fields',
	__NAMESPACE__ . '\filter_project_task_fields',
	10,
	1
);

// Define functionality.

/**
 * Enqueues custom shortcode assets.
 *
 * @link https://docs.purpleturtlecreative.com/completionist/shortcodes/customizations/#enqueueing-custom-assets
 *
 * @param string $shortcode_tag The shortcode tag being rendered.
 */
function enqueue_shortcode_assets( string $shortcode_tag ) {
	if ( 'ptc_asana_project' === $shortcode_tag ) {

		wp_enqueue_script(
			'completionist-custom-fields',
			plugins_url( '/script.js', __FILE__ ),
			array( 'ptc-completionist-shortcode-asana-project' ),
			filemtime( __DIR__ . '/script.js' ),
			true
		);

		wp_enqueue_style(
			'completionist-custom-fields',
			plugins_url( '/styles.css', __FILE__ ),
			array( 'ptc-completionist-shortcode-asana-project' ),
			filemtime( __DIR__ . '/styles.css' ),
			'all'
		);
	}
}

/**
 * Adds custom fields data to Asana project tasks.
 *
 * @link https://developers.asana.com/reference/gettask See all
 * supported Asana task fields in the HTTP 200 response.
 *
 * @param string $task_fields The ?opt_fields CSV string.
 *
 * @return string The modified ?opt_fields CSV string.
 */
function filter_project_task_fields( string $task_fields ) : string {
	return $task_fields . ',custom_fields,custom_fields.name,custom_fields.display_value';
}
