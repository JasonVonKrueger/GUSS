import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '26362f383a70475694d6b0b0f6f6c49f'
                    }
                    'guss-menu': {
                        table: 'sys_app_application'
                        id: '34ecc5e1dc4c4d0385955976c1bcee87'
                    }
                    'guss-module': {
                        table: 'sys_app_module'
                        id: '38fd3bb0a25845759b8ada1127db7e1e'
                    }
                    GussAjax: {
                        table: 'sys_script_include'
                        id: '5e4d2581bcdc4fdab31a7256d99f0968'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'e6913231dd5f4682bc07775a8fbe03f8'
                    }
                    'src_server_script-includes_guss-ajax_js': {
                        table: 'sys_module'
                        id: '92a832564ebe46eca35b8881c9b4544d'
                        deleted: true
                    }
                }
                composite: [
                    {
                        table: 'sys_ux_lib_asset'
                        id: '19d863b6924a43c99757970733542394'
                        key: {
                            name: 'x_159204_guss/main.js.map'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '28994f28f8d04dbeb0b5339b92b4c49d'
                        key: {
                            application_file: '36b7ae287dbb4d0b81ec59838e46e92b'
                            source_artifact: '49debe9bebdf484fb0dec33b0a2559eb'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '2b96966b4ca143c3905af3f8505c4a39'
                        key: {
                            application_file: '533be39359ee43f6b73a83dac1b3dc61'
                            source_artifact: '49debe9bebdf484fb0dec33b0a2559eb'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '36b7ae287dbb4d0b81ec59838e46e92b'
                        key: {
                            endpoint: 'x_159204_guss_main.do'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '3f6362a858f0436bb22f754d0bf2ec3b'
                        key: {
                            application_file: '19d863b6924a43c99757970733542394'
                            source_artifact: '49debe9bebdf484fb0dec33b0a2559eb'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '49debe9bebdf484fb0dec33b0a2559eb'
                        key: {
                            name: 'x_159204_guss_main.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '533be39359ee43f6b73a83dac1b3dc61'
                        key: {
                            name: 'x_159204_guss/main'
                        }
                    },
                ]
            }
        }
    }
}
