// Determine if the task should show/allow a toggle for expansion.

window.Completionist.hooks.addFilter(
	'TaskListItem_if_render_toggle',
	'completionist-custom-fields',
	( renderToggle, task ) => {
		if ( 'custom_fields' in task ) {
			// There might be custom fields for display,
			// so render space for the toggle.
			renderToggle = true;
		}
		return renderToggle;
	}
);

window.Completionist.hooks.addFilter(
	'TaskListItem_if_allow_toggle',
	'completionist-custom-fields',
	( allowToggle, task ) => {
		if ( task?.custom_fields?.length ) {
			// There are custom fields which will be displayed,
			// so allow the task to be toggled open.
			allowToggle = true;
		}
		return allowToggle;
	}
);

// Render key custom fields in TaskListItem main row,
// to display when the task is collapsed.
window.Completionist.hooks.addFilter(
	'TaskListItem_main_row_content',
	'completionist-custom-fields',
	( content, task ) => {

		if ( task?.custom_fields?.length ) {

			// Define desired fields to display.
			const keyFieldNames = [
				'Task Type',
				'SEO Impact',
			];

			const keyFields = task.custom_fields.filter(
				field => keyFieldNames.includes( field?.name )
			).map(
				field => window.wp.element.createElement(
					'p',
					{ className: 'completionist-custom-field-badge' },
					`${field?.name}: ${field?.display_value ?? '–'}`
				)
			);

			// Insert the custom fields after the task name.
			content.splice( 1, 0, ...keyFields );
		}

		return content;
	}
);

// Add table of custom fields after the task description,
// to display when the task is expanded.
window.Completionist.hooks.addFilter(
	'TaskListItem_content_after_description',
	'completionist-custom-fields',
	( content, task ) => {

		if ( task?.custom_fields?.length ) {

			const custom_fields_trs = task.custom_fields.map(
				field => `
					<tr>
						<td>${field?.name}</td>
						<td>${field?.display_value ?? '–'}</td>
					</tr>
				`
			);

			const markup = {
				__html: `
					<p class="small-label">Custom Fields</p>
					<table>
						<thead>
							<tr>
								<th>Field Name</th>
								<th>Field Value</th>
							</tr>
						</thead>
						<tbody>
							${custom_fields_trs.join("\n")}
						</tbody>
					</table>
				`
			};

			const node = window.wp.element.createElement(
				'div',
				{
					className: 'completionist-custom-fields',
					dangerouslySetInnerHTML: markup,
				}
			);

			content.push( node );
		}

		return content;
	}
);
