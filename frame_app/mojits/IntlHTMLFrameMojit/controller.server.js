/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('IntlHTMLFrameMojit', function (Y, NAME) {

    'use strict';

    Y.namespace('mojito.controllers')[NAME] = {

        index: function (ac) {
            this.__call(ac);
        },

        __call: function (ac) {

            Y.log('executing IntlHTMLFrameMojit child', 'mojito', 'qeperf');

            this._renderChild(ac, function (data, meta) {

                // meta.assets from child should be piped into
                // the frame's assets before doing anything else.
                ac.assets.addAssets(meta.assets);

                // SHAKER RUNTIME!
                // NOTE: We move the deployment of the client to within Shaker addon...
                ac.shaker.run(meta);

                Y.log('IntlHTMLFrameMojit done()', 'mojito', 'qeperf');

                // 1. mixing bottom and top fragments from assets into
                //    the template data, along with title and mojito version.
                // 2. mixing meta with child metas, along with some extra
                //    headers.
                ac.done(
                    Y.merge(data, ac.assets.renderLocations(), {
                        "name": "IntlHtmlFrameMojit",
                        "greeting": ac.intl.lang("GREETING"),
                        "says": ac.intl.lang("SAYS"),
                        "preposition": ac.intl.lang("PREPOSITION"),
                        "today": ac.intl.formatDate(new Date()),
                        "enableDynamicTitle": ac.config.get('enableDynamicTitle'),
                        "mojito_version": Y.mojito.version

                    }),
                    Y.merge(meta, {

                        http: {
                            headers: {
                                'content-type': 'text/html; charset="utf-8"'
                            }
                        },

                        view: {
                            name: 'index'
                        }

                    })
                );

            });

        },

        /**
         * Renders a child mojit based on a config called "child" and
         * the "assets" collection specified in the specs.
         * @method _renderChild
         * @protected
         * @param {Object} ac Action Context Object.
         * @param {Function} callback The callback.
         */
        _renderChild: function (ac, callback) {
            // Grab the "child" from the config an add it as the
            // only item in the "children" map.
            // var child = ac.config.get('child'),
            var children = ac.config.get('children'),
                cfg;
             
            cfg = { children: children, assets: ac.config.get('assets')};
            // Now execute the child as a composite
            ac.composite.execute(cfg, callback);
        }

    };

}, '0.1.0', {requires: [
    'mojito',
    'mojito-assets-addon',
    'mojito-deploy-addon',
    'mojito-config-addon',
    'mojito-composite-addon',
    'mojito-shaker-addon',
    'mojito-intl-addon'
]});
