var $http = require('http-as-promised');

$http.debug = true;
$http.request = require('request-debug')($http.request);

var baseUri = process.env.BASE_URI;

$http({
    uri: baseUri + '/posts', method: 'POST', json: {
        "posts": [
            {
                "title": "Dependency Injection is Not a Virtue"
            }
        ]
    }
})
    .spread(function (response, post1) {

        var postId = post1.posts[0].id.toString();
        return $http({
            uri: baseUri + '/posts/' + postId, method: 'PUT', headers: {Accept: 'application/json'}, json: {
                posts: [
                    {
                        id: postId,
                        closed: true
                    }
                ]
            }
        }).then(function () {
            return $http({
                uri: baseUri + '/comments', method: 'POST', headers: {Accept: 'application/json'}, json: {
                    comments: [
                        {
                            body: "Dependency Injection is Not a Vice",
                            links: {
                                post: [postId]
                            }
                        }
                    ]
                }
            });
        })

    })
    .catch(function (e) {
        console.trace(e);
    });