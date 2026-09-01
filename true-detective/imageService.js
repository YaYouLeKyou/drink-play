(function (global) {
    'use strict';

    var cache = new Map();
    var imageCounter = 0;

    var POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt/';
    var HF_BASE = 'https://api-inference.hf-mirror.com/models/';
    var HF_MODELS = [
        'stabilityai/stable-diffusion-xl-base-1.0',
        'stabilityai/stable-diffusion-2-1',
        'runwayml/stable-diffusion-v1-5',
        'prompthero/openjourney',
        'darkstorm21/stable-diffusion',
    ];

    var puterLoaded = false;
    var puterPromise = null;

    var ARCHETYPES = {
        'detective': 'A sharp, observant detective partner holding a notebook',
        'suspect_rich': 'An arrogant, wealthy suspect with an imposing posture and expensive attire',
        'femme_fatale': 'A charming and mysterious suspect, seductive posture, intense dark gaze',
        'informant': 'A nervous, secretive informant looking over their shoulder, holding a hidden item',
        'scientist': 'An eccentric scientific expert wearing protective gear or specialized glasses, holding analysis tools',
        'bodyguard': 'A tall, heavily built bodyguard or enforcer with a stern expression and folded arms',
        'criminal': 'A menacing, calculated criminal mastermind wearing dark clothing, half hidden in shadow',
        'outsider': 'An unpredictable, unhinged outsider with wild eyes and disheveled clothes',
    };

    var THEME_DESCRIPTORS = {
        'agatha-christie': 'An elegant 1930s aristocrat or suspect, wearing refined period clothing, sharp attire, clean line art style, high contrast, moody color palette',
        'sherlock-holmes': 'A 19th-century Victorian gentleman or witness, wearing a tailcoat, top hat, or waistcoat, suspicious posture, clean line art style, cinematic lighting',
        'cyberpunk': 'A futuristic cyberpunk hacker or street operative, augmented cyberware implants, leather jacket, neon cyan highlights, clean line art style, high contrast',
        'heroic-fantasy': 'A mysterious fantasy guild master or mage, wearing ornate dark robes, holding a subtle relic, clean line art comic book style, high contrast',
        'sci-fi': 'A space station commander or alien suspect, wearing a sleek modern flight suit, high-tech gadgetry, clean line art style, atmospheric shadows',
        'lovecraftian': 'A pale cultist or unhinged scholar, holding an ancient grimoire, unsettling gaze, dark comic book line art, deep blues and shadowy tones',
        'antiquite': 'An ancient Roman senator or Egyptian noble, wearing traditional toga or robes with gold trim, calculating look, clean graphic line art',
    };

    function encodePrompt(prompt) {
        return encodeURIComponent(prompt);
    }

    function loadPuterScript() {
        if (puterLoaded) { return Promise.resolve(); }
        if (puterPromise) { return puterPromise; }

        puterPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://js.puter.com/v2/';
            script.async = true;
            script.onload = function () {
                puterLoaded = true;
                resolve();
            };
            script.onerror = function () {
                reject(new Error('Failed to load Puter script'));
            };
            document.head.appendChild(script);
        });
        return puterPromise;
    }

    function fetchWithTimeout(url, options, timeout) {
        timeout = timeout || 15000;
        var controller = new AbortController();
        var timeoutId = setTimeout(function () {
            controller.abort();
        }, timeout);

        return fetch(url, Object.assign({}, options, { signal: controller.signal }))
            .then(function (response) {
                clearTimeout(timeoutId);
                return response;
            })
            .catch(function (e) {
                clearTimeout(timeoutId);
                throw e;
            });
    }

    function tryPollinations(prompt, opts) {
        opts = opts || {};
        var width = opts.width || 1024;
        var height = opts.height || 576;
        var model = opts.model || 'flux';
        var url = POLLINATIONS_BASE + encodePrompt(prompt) + '?width=' + width + '&height=' + height + '&model=' + model;

        return fetchWithTimeout(url, {}, 15000)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Pollinations HTTP ' + response.status);
                }
                return response.blob();
            })
            .then(function (blob) {
                if (blob.type === 'text/html' || blob.size < 100) {
                    throw new Error('Pollinations returned invalid content');
                }
                return URL.createObjectURL(blob);
            });
    }

    function tryPuter(prompt, opts) {
        opts = opts || {};
        return loadPuterScript()
            .then(function () {
                if (typeof global.puter === 'undefined' || !global.puter.ai || !global.puter.ai.txt2img) {
                    throw new Error('Puter.ai not available');
                }
                return global.puter.ai.txt2img(prompt, {
                    width: opts.width || 1024,
                    height: opts.height || 576,
                });
            })
            .then(function (result) {
                if (result && result.url) {
                    return result.url;
                }
                if (result && typeof result === 'string') {
                    return result;
                }
                throw new Error('Puter did not return an image URL');
            });
    }

    function tryHuggingFace(prompt, opts) {
        opts = opts || {};
        var models = opts.models || HF_MODELS;

        return models.reduce(function (chain, model) {
            return chain.catch(function () {
                return fetchWithTimeout(
                    HF_BASE + encodePrompt(model),
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ inputs: prompt }),
                    },
                    20000
                )
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error('HF HTTP ' + response.status);
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        if (data && data.error) {
                            throw new Error(data.error);
                        }
                        if (data && data.generated_image) {
                            return 'data:image/png;base64,' + data.generated_image;
                        }
                        if (Array.isArray(data) && data[0]) {
                            if (data[0].image) {
                                return 'data:image/png;base64,' + data[0].image;
                            }
                            if (data[0].url) {
                                return data[0].url;
                            }
                        }
                        throw new Error('No image in HF response');
                    });
            });
        }, Promise.reject(new Error('Starting HF chain')));
    }

    function generateImage(prompt, opts) {
        opts = opts || {};
        var cacheKey = prompt + '|' + JSON.stringify(opts);
        if (cache.has(cacheKey)) {
            return Promise.resolve(cache.get(cacheKey));
        }

        var imageId = 'td-img-' + (++imageCounter);

        return tryPollinations(prompt, opts)
            .then(function (url) {
                cache.set(cacheKey, url);
                return url;
            })
            .catch(function (pollError) {
                console.warn('[ImageService] Pollinations failed:', pollError.message);
                return tryPuter(prompt, opts)
                    .then(function (url) {
                        cache.set(cacheKey, url);
                        return url;
                    })
                    .catch(function (puterError) {
                        console.warn('[ImageService] Puter failed:', puterError.message);
                        return tryHuggingFace(prompt, opts)
                            .then(function (url) {
                                cache.set(cacheKey, url);
                                return url;
                            })
                            .catch(function (hfError) {
                                console.error('[ImageService] All methods failed:', hfError.message);
                                throw hfError || pollError;
                            });
                    });
            });
    }

    function buildCharacterPrompt(archetype, themeId, themeDescriptor) {
        var archetypeDesc = ARCHETYPES[archetype] || archetype;
        var themeDesc = themeDescriptor || THEME_DESCRIPTORS[themeId] || themeId;
        return 'Full body character visual of ' + archetypeDesc + ' in a ' + themeId + ' setting, ' + themeDesc +
            ', isolated on solid white background, clean comic book line art style, high contrast, ' +
            'moody cinematic color palette, transparent style character cutout, no background';
    }

    function generateBackground(prompt, theme) {
        var fullPrompt = prompt + ', ' + (theme || 'detective') + ' scene, cinematic lighting, ' +
            'moody atmosphere, dark blues and greys, digital art style, 16:9';
        return generateImage(fullPrompt, { width: 1024, height: 576 });
    }

    function generateCharacter(archetype, themeId, themeDescriptor) {
        var prompt = buildCharacterPrompt(archetype, themeId, themeDescriptor);
        return generateImage(prompt, { width: 512, height: 512 });
    }

    function generateNpcImage(npc, themeId) {
        if (!npc) {
            return generateCharacter('detective', themeId, null);
        }
        var archetype = npc.archetype || 'detective';
        return generateCharacter(archetype, themeId, THEME_DESCRIPTORS[themeId]);
    }

    function generateSceneBackground(location, themeId, musicPrompt) {
        var themeLabel = THEME_DESCRIPTORS[themeId] || themeId;
        var prompt = location + ', ' + themeLabel + ', ' + themeId + ' scene, ' +
            'cinematic lighting, moody atmosphere, dark blues and greys, digital art style, 16:9';
        if (musicPrompt) {
            prompt += ', music: ' + musicPrompt.substring(0, 120);
        }
        return generateImage(prompt, { width: 1024, height: 576 });
    }

    global.TDImageService = {
        generateImage: generateImage,
        generateBackground: generateBackground,
        generateCharacter: generateCharacter,
        generateNpcImage: generateNpcImage,
        generateSceneBackground: generateSceneBackground,
        buildCharacterPrompt: buildCharacterPrompt,
        ARCHETYPES: ARCHETYPES,
        THEME_DESCRIPTORS: THEME_DESCRIPTORS,
        cache: cache,
        clearCache: function () { cache.clear(); },
    };
})(typeof window !== 'undefined' ? window : global);
