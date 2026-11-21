const CACHE_NAME = "sgf-mobile-v1";

const FILES_TO_CACHE = [

    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"

];

/* =========================
   INSTALAÇÃO
========================= */

self.addEventListener(

    "install",

    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(

                cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }

            )

        );

        self.skipWaiting();

    }

);

/* =========================
   ATIVAÇÃO
========================= */

self.addEventListener(

    "activate",

    event => {

        event.waitUntil(

            caches.keys()

            .then(

                keys => {

                    return Promise.all(

                        keys.map(

                            key => {

                                if (

                                    key !==
                                    CACHE_NAME

                                ) {

                                    return caches.delete(
                                        key
                                    );

                                }

                            }

                        )

                    );

                }

            )

        );

        self.clients.claim();

    }

);

/* =========================
   FETCH
========================= */

self.addEventListener(

    "fetch",

    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(

                response => {

                    if (

                        response

                    ) {

                        return response;

                    }

                    return fetch(
                        event.request
                    )

                    .then(

                        networkResponse => {

                            if (

                                !networkResponse ||
                                networkResponse.status !== 200 ||
                                networkResponse.type !== "basic"

                            ) {

                                return networkResponse;

                            }

                            let responseClone =
                            networkResponse.clone();

                            caches.open(
                                CACHE_NAME
                            )

                            .then(

                                cache => {

                                    cache.put(

                                        event.request,

                                        responseClone

                                    );

                                }

                            );

                            return networkResponse;

                        }

                    )

                    .catch(

                        () => {

                            if (

                                event.request.mode ===
                                "navigate"

                            ) {

                                return caches.match(
                                    "./index.html"
                                );

                            }

                        }

                    );

                }

            )

        );

    }

);

/* =========================
   MENSAGENS
========================= */

self.addEventListener(

    "message",

    event => {

        if (

            event.data ===
            "skipWaiting"

        ) {

            self.skipWaiting();

        }

    }

);