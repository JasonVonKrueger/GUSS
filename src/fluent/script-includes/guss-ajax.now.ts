import "@servicenow/sdk/global";
import { ScriptInclude } from "@servicenow/sdk/core";

const gussAjaxScript = `var GussAjax = Class.create();
GussAjax.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
    getUpdateSetFiles: function() {
        var result = { updateSet: {}, files: [] };

        var gus = new GlideUpdateSet();
        var updateSetId = gus.get();

        if (!updateSetId) {
            return JSON.stringify(result);
        }

        var usGr = new GlideRecord('sys_update_set');
        if (usGr.get(updateSetId)) {
            result.updateSet = {
                sys_id: usGr.getUniqueValue(),
                name: usGr.getValue('name')
            };
        }

        var gr = new GlideRecord('sys_update_xml');
        gr.addQuery('update_set', updateSetId);
        gr.orderBy('type');
        gr.orderBy('name');
        gr.query();

        while (gr.next()) {
            result.files.push({
                sys_id: gr.getUniqueValue(),
                name: gr.getValue('name'),
                type: gr.getValue('type'),
                target_name: gr.getDisplayValue('name'),
                table: gr.getValue('name').split('_').slice(0, -1).join('_'),
                action: gr.getValue('action')
            });
        }

        return JSON.stringify(result);
    },
    type: 'GussAjax'
});`;

export const GussAjax = ScriptInclude({
  $id: Now.ID["GussAjax"],
  name: "GussAjax",
  script: gussAjaxScript,
  description: "AJAX processor for fetching update set files grouped by type",
  clientCallable: true,
  accessibleFrom: "public",
});
