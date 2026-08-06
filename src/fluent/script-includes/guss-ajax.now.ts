import "@servicenow/sdk/global";
import { ScriptInclude } from "@servicenow/sdk/core";

const gussAjaxScript = `var GussAjax = Class.create();
GussAjax.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
    getUpdateSetFiles: function() {
        var result = { updateSet: {}, folders: [] };

        // Resolve current update set using user preference, which works in scoped apps.
        var updateSetId = '';
        var prefGr = new GlideRecord('sys_user_preference');
        prefGr.addQuery('name', 'sys_update_set');
        prefGr.addQuery('user', gs.getUserID());
        prefGr.orderByDesc('sys_updated_on');
        prefGr.setLimit(1);
        prefGr.query();
        if (prefGr.next()) {
            updateSetId = prefGr.getValue('value') || '';
        }

        // Fallback for environments where preference is not available.
        if (!updateSetId) {
            try {
                updateSetId = GlideUpdateManager2.get() || '';
            } catch (e) {
                updateSetId = '';
            }
        }

        if (!updateSetId) {
            return JSON.stringify(result);
        }

        var usGr = new GlideRecord('sys_update_set');
        if (usGr.get(updateSetId)) {
            result.updateSet = {
                sys_id: usGr.getUniqueValue(),
                name: usGr.getValue('name'),
                app_scope: usGr.getValue('application')
            };
        }

        // Collect unique types (folders) in order
        var au = new ArrayUtil();
        var folderTypes = [];
        var typeGr = new GlideRecord('sys_update_xml');
        typeGr.addEncodedQuery('update_set=' + updateSetId);
        typeGr.orderBy('type');
        typeGr.query();
        while (typeGr.next()) {
            var t = typeGr.getValue('type');
            if (!au.contains(folderTypes, t)) {
                folderTypes.push(t);
            }
        }

        // For each type, collect files (skip deletes)
        for (var i = 0; i < folderTypes.length; i++) {
            var folder = folderTypes[i];
            var files = [];

            var gr = new GlideRecord('sys_update_xml');
            gr.addEncodedQuery('update_set=' + updateSetId + '^type=' + folder + '^action!=delete');
            gr.orderBy('target_name');
            gr.query();

            while (gr.next()) {
                var name = gr.getValue('name');
                var o = {
                    sys_id: gr.getUniqueValue(),
                    name: name,
                    type: folder,
                    target_name: gr.getValue('target_name') || name,
                    action: gr.getValue('action'),
                    table_name: '',
                    artifact_sys_id: '',
                    file_name: ''
                };

                try {
                    var payload = gr.payload + '';
                    var xmlDoc = new XMLDocument2();
                    xmlDoc.parseXML(payload);
                    var classNode = xmlDoc.getFirstNode('//sys_class_name');
                    var idNode = xmlDoc.getFirstNode('//sys_id');
                    if (classNode) { o.table_name = classNode.getTextContent(); }
                    if (idNode) { o.artifact_sys_id = idNode.getTextContent(); }
                    if (o.table_name && o.artifact_sys_id) {
                        var rec = new GlideRecord(o.table_name);
                        if (rec.get(o.artifact_sys_id)) {
                            o.file_name = rec.getDisplayValue();
                        }
                    }
                } catch (err) {
                    gs.log('GUSS: Failed to parse payload for ' + name);
                }

                files.push(o);
            }

            result.folders.push({ folder: folder, files: files });
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
