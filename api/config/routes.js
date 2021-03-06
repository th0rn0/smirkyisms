/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'POST /image': { action: 'image/upload' },
  'POST /video': { action: 'video/upload' },
  'GET /quote/random': { action: 'quote/random' },
  'GET /quote': { action: 'quote/index' },
  'GET /quote/:quoteId': { action: 'quote/show' },
  'GET /quote/user/:userId/': { action: 'quote/user' },
  'GET /image/random': { action: 'image/random' },
  'GET /image': { action: 'image/index' },
  'GET /image/:imageId': { action: 'image/show' },
  'GET /image/user/:userId/': { action: 'image/user' },
  'GET /image/:imageId/file': { action: 'image/file' },
  'GET /video': { action: 'video/index' },
  'GET /video/:videoId': { action: 'video/show' },
  'GET /video/random': { action: 'video/random' },
  'GET /video/user/:userId/': { action: 'video/user' },
  'GET /video/:videoId/file': { action: 'video/file' },
  'GET /video/:videoId/thumbnail': { action: 'video/thumbnail' },

  // 'GET /users': { action: 'user/index' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
