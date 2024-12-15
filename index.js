const version = 1
const metadataObjectID = "CSMETADATA"
const header = "ȻȘ"
const headerRegex = /ȻȘ-\d+_/g
const headerIndexRegex = /(?<=ȻȘ-)\d+(?=_)/g

function findMetadata(level) {
    let metadata = null;

    level.objects.forEach((object) => {
        if (object.id === metadataObjectID) {
            try { 
                metadata = JSON.parse(object.text);
                return;
            } catch (oops) { console.error(`Malformed metadata found: ${object.text}`); }
        }
    })

    if (metadata) {
        return metadata;
    } else {
        return false;
    }
}

function deleteMetadataObject(level) {
    level.objects.forEach((object, i) => {
        if (object.id == metadataObjectID) {
            level.objects[i].splice(i, 1);
        }
    })
}

function tagObjects(objects, header, index) {
    if (!objects) { return []; }
    objects.forEach((object) => {
        object.id = `${header}-${index}_${object.id}`;
        if (object.p_id) { object.p_id = `${header}-${index}_${object.p_id}`; }
    })
    return objects;
}

function tagPrefabs(prefabs, header, index) {
    if (!prefabs) { return []; }
    prefabs.forEach((prefab) => {
        prefab.id = `${header}-${index}_${prefab.id}`;
        if (!prefab.objs) { return; }
        prefab.objs = tagObjects(prefab.objs, header, index);
    })
    return prefabs;
}

function tagPrefabObjects(prefabObjects, header, index) {
    if (!prefabObjects) { return []; }
    prefabObjects.forEach((prefabObject) => {
        prefabObject.id = `${header}-${index}_${prefabObject.id}`;
        if (prefabObject.p_id) { prefabObject.p_id = `${header}-${index}_${prefabObject.p_id}`; }
    })
    return prefabObjects;
}

function tagMarkers(markers, header, index) {
    if (!markers) { return []; }
    markers.forEach((marker) => {
        marker.ID = `${header}-${index}_${marker.ID}`;
    })
    return markers;
}

function tagCheckpoints(checkpoints, header, index) {
    if (!checkpoints) { return []; }
    checkpoints.forEach((checkpoint) => {
        checkpoint.ID = `${header}-${index}_${checkpoint.ID}`;
    })
    return checkpoints;
}

function tagThemes(themes, header, index) {
    if (!themes) { return []; }
    themes.forEach((theme) => {
        theme.id = `${header}-${index}_${theme.id}`;
    })
    return themes;
}

function untagObjects(objects, regex) {
    if (!objects) { return; }
    objects.forEach((object) => {
        if (!(object.id.match(regex))) { return; }

        object.id = object.id.replace(regex, '');
        if (object.p_id) {
            object.p_id = object.p_id.replace(regex, '');
        }
    });
    return objects;
}

function untagPrefabs(prefabs, regex) {
    if (!prefabs) { return; }
    prefabs.forEach((prefab) => {
        if (!(prefab.id.match(regex))) { return; }
        prefab.id = prefab.id.replace(regex, '');
        if (!prefab.objs) { return; }
        prefab.objs = untagObjects(prefab.objs);
    });
    return prefabs;
}

function untagPrefabObjects(prefabObjects, regex) {
    if (!prefabObjects) { return; }
    prefabObjects.forEach((prefabObject) => {
        if (!(prefabObject.id.match(regex))) { return; }

        prefabObject.id = prefabObject.id.replace(regex, '');
        if (prefabObject.p_id) {
            prefabObject.p_id = prefabObject.p_id.replace(regex, '');
        }
    });
    return prefabObjects;
}

function untagMarkers(markers, regex) {
    if (!markers) { return; }
    markers.forEach((marker) => {
        if (!(marker.ID.match(regex))) { return; }
        marker.ID = marker.ID.replace(regex, '');
    });
    return markers;
}

function untagCheckpoints(checkpoints, regex) {
    if (!checkpoints) { return; }
    checkpoints.forEach((checkpoint) => {
        if (!(checkpoint.ID.match(regex))) { return; }
        checkpoint.ID = checkpoint.ID.replace(regex, '');
    });
    return checkpoints;
}

function untagThemes(themes, regex) {
    if (!themes) { return; }
    themes.forEach((theme) => {
        if (!(theme.id.match(regex))) { return; }
        theme.id = theme.id.replace(regex, '');
    });
    return themes;
}

function generateMetadataObject(levelsData) {
    const skeleton = {
        id: metadataObjectID,
        ak_t: 2,
        ak_o: 0,
        ot: 0,
        s: 4,
        n: `CollabSync Metadata`,
        text: '',
        o: {
            x: 0,
            y: 0
        },
        ed:{l:0},
        e: [
            {k: [{ev: [0, 0]}]},
            {k: [{ev: [0, 0]}]},
            {k: [{ev: [0]}]},
            {k: [{ev: [0]}]}
        ],
        st: -999 // lel
    }

    let metadata = []

    levelsData.forEach((data, i) => {
        metadata.push({
            version: version,
            index: i,
            audioDuration: data.audioDuration,
            combineOptions: data.combineOptions,
            metadata: data.metadata,
            level: {
                editor: data.level.editor,
                objects: data.combineOptions.objects ? [] : data.level.objects ?? [],
                parallax_settings: data.level.parallax_settings ?? {},
                prefabs: data.combineOptions.prefabs ? [] : data.level.prefabs ?? [],
                unpackedPrefabs: data.combineOptions.unpackedPrefabs ? [] : data.level.prefab_objects ?? [],
                markers: data.combineOptions.markers ? [] : data.level.markers ?? [],
                checkpoints: data.combineOptions.checkpoints ? [] : data.level.checkpoints ?? [],
                themes: data.combineOptions.themes ? [] : data.level.themes ?? [],
                events: data.level.events ?? [],
                triggers: data.level.triggers ?? [],
            }
        })
    })

    skeleton.text = JSON.stringify(metadata);
    return skeleton;
}

function countObjects(level) {
    const data = {
        objects: 0,
        parallaxObjects: 0,
        prefabs: 0,
        unpackedPrefabs: 0,
        markers: 0,
        checkpoints: 0,
        themes: 0,
        events: 0,
        triggers: 0
    }

    if (level.objects) {
        data.objects += level.objects.length ?? 0;
    };

    if (level.parallax_settings) {
        if (level.parallax_settings.l) {
            level.parallax_settings.l.forEach((entry) => {
                if (entry.o) {
                data.parallaxObjects += entry.o.length;
                }
            })
        }
    }

    if (level.prefabs) {
        data.prefabs += level.prefabs.length ?? 0;
    };

    if (level.prefab_objects) {
        data.unpackedPrefabs += level.prefab_objects.length ?? 0;
    }

    if (level.markers) {
        data.markers += level.markers.length ?? 0;
    }

    if (level.checkpoints) {
        data.checkpoints += level.checkpoints.length ?? 0;
    }

    if (level.themes) {
        data.themes += level.themes.length ?? 0;
    }

    if (level.events) {
        for (let x = 0; x < level.events.length; x++) {
            data.events += level.events[x].length ?? 0;
        }
    }

    if (level.triggers) {
        data.triggers += level.triggers.length ?? 0;
    }

    return data;
}

function countTotalObjects(levelsData) {
    const data = {
        objects: 0,
        parallaxObjects: 0,
        prefabs: 0,
        unpackedPrefabs: 0,
        markers: 0,
        checkpoints: 0,
        themes: 0,
        events: 0,
        triggers: 0
    }

    levelsData.forEach((levelData) => {
        const counts = countObjects(levelData.level);
        for (const key in counts) {
            if (levelData.combineOptions[key]) {
                data[key] = data[key] + counts[key];
            }
        }
    })

    return data;
}

function getPartLength(part) {
    let startTime = 99999;
    let endTime = 0;
    part.objects.forEach((object) => {
        if (object.st < startTime) {
            startTime = object.st;
        }

        if ((object.st + object.ak_o) > endTime) {
            endTime = (object.st + object.ak_o);
        }
    })

    return {
        startTime: startTime,
        endTime: endTime
    }
}

function sortParts(levelsData) {
    let temp = [];
    levelsData.forEach((data) => {
        const times = getPartLength(data.level);
        temp.push({ 
            startTime: times.startTime,
            data: data 
        })
    })

    let sorted = temp.sort((a, b) => a.startTime - b.startTime);
    temp = [];
    return sorted.map(item => item.data);
}

function splitLevelParts(levelData, metadata) {
    const newLevelsData = [];

    metadata.forEach((entry) => {
        const object = {
            audioDuration: entry.audioDuration,
            combineOptions: entry.combineOptions,
            metadata: entry.metadata,
            level: {
                editor: entry.level.editor,
                objects: entry.level.objects ?? [],
                parallax_settings: entry.level.parallax_settings ?? {},
                prefabs: entry.level.prefabs ?? [],
                prefab_objects: entry.level.prefab_objects ?? [],
                markers: entry.level.markers ?? [],
                checkpoints: entry.level.checkpoints ?? [],
                themes: entry.level.themes ?? [],
                events: entry.level.events ?? [],
                triggers: entry.level.triggers ?? [],
            }
        }
        newLevelsData.push(object);
    })

    if (levelData.level.objects) {
        levelData.level.objects.forEach((object) => {
            if (object) {
                if (object.id.match(headerIndexRegex)) { // If the ID has any trace of tagging
                    if (newLevelsData[object.id.match(headerIndexRegex)[0]]) { // If the extracted level index exists in the metadata
                        newLevelsData[object.id.match(headerIndexRegex)[0]].level.objects.push(object);
                    }
                }
            }
        })
    }

    if (levelData.level.prefabs) {
        levelData.level.prefabs.forEach((prefab) => {
            if (prefab) {
                if (prefab.id.match(headerIndexRegex)) {
                    if (newLevelsData[prefab.id.match(headerIndexRegex)[0]]) {
                        newLevelsData[prefab.id.match(headerIndexRegex)[0]].level.prefabs.push(prefab);
                    }
                }
            }
        })
    }

    if (levelData.level.prefab_objects) {
        levelData.level.prefab_objects.forEach((prefabObject) => {
            if (prefabObject) {
                if (prefabObject.id.match(headerIndexRegex)) {
                    if (newLevelsData[prefabObject.id.match(headerIndexRegex)[0]]) {
                        newLevelsData[prefabObject.id.match(headerIndexRegex)[0]].level.prefab_objects.push(prefabObject);
                    }
                }
            }
        })
    }

    if (levelData.level.markers) {
        levelData.level.markers.forEach((marker) => {
            if (marker) {
                if (marker.ID.match(headerIndexRegex)) {
                    if (newLevelsData[marker.ID.match(headerIndexRegex)[0]]) {
                        newLevelsData[marker.ID.match(headerIndexRegex)[0]].level.markers.push(marker);
                    }
                }
            }
        })
    }

    if (levelData.level.checkpoints) {
        levelData.level.checkpoints.forEach((checkpoint) => {
            if (checkpoint) {
                if (checkpoint.ID.match(headerIndexRegex)) { // why the fuck is the "ID" entry capitalized for markers and checkpoints
                    if (newLevelsData[checkpoint.ID.match(headerIndexRegex)[0]]) {
                        newLevelsData[checkpoint.ID.match(headerIndexRegex)[0]].level.checkpoints.push(checkpoint);
                    }
                }
            }
        })
    }

    if (levelData.level.themes) {
        levelData.level.themes.forEach((theme) => {
            if (theme) {
                if (theme.id.match(headerIndexRegex)) {
                    if (newLevelsData[theme.id.match(headerIndexRegex)[0]]) {
                        newLevelsData[theme.id.match(headerIndexRegex)[0]].level.themes.push(theme);
                    }
                }
            }
        })
    }

    if (levelData.level.triggers) {
        levelData.level.triggers.forEach((trigger) => {
            if (trigger) {
                if (trigger.id.match(headerIndexRegex)) {
                    if (newLevelsData[trigger.id.match(headerIndexRegex)[0]]) {
                        newLevelsData[trigger.id.match(headerIndexRegex)[0]].level.triggers.push(trigger);
                    }
                }
            }
        })
    }

    return newLevelsData;
}

function combineObjects(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_objects = level_one.objects;
    let level_two_objects = level_two.objects;

    if (level_two_objects.length < 1) {
        return result;
    }

    let objects = level_one_objects.concat(level_two_objects); // Store combined objects
    result.objects = objects; // Replace level 1 objects with combined objects
    return result;
}

function combineMarkers(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_markers = level_one.markers;
    let level_two_markers = level_two.markers;

    if (level_two_markers.length < 1) {
        return result;
    }

    let markers = level_one_markers.concat(level_two_markers); // Store combined markers
    result.markers = markers; // Replace level 1 markers with combined markers
    return result;
}

function combineCheckpoints(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_checkpoints = level_one.checkpoints;
    let level_two_checkpoints = level_two.checkpoints;

    if (level_two_checkpoints.length < 1) {
        return result;
    }

    if (level_two_checkpoints[0].n == "Base Checkpoint") {
        level_two_checkpoints.splice(0, 1) // Make sure there are no duplicate base checkpoints
    }

    let checkpoints = level_one_checkpoints.concat(level_two_checkpoints); // Store combined checkpoints
    result.checkpoints = checkpoints; // Replace level 1 checkpoints with combined checkpoints  
    return result;
}

function combineEvents(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_events = level_one.events;
    let level_two_events = level_two.events;

    let events = [] // Define now to use in for loop scope

    for (let x = 0; x<level_two_events.length; x++) {
        if (level_two_events[x] === undefined) { level_two_events[x] = []; }

        if (level_two_events[x].length > 0) {
            if (level_two_events[x][0].t === undefined) { // If an event doesn't have a 't' value, it's a base event and must be removed
                level_two_events[x].splice(0, 1)
            } // Now that base keyframes have been sanitized
        }

        if (level_two_events[x].length > 0) {
            events[x] = level_one_events[x].concat(level_two_events[x]) // Combine all event keyframes of the same type
        } else {
            events[x] = level_one_events[x];
        }
    }

    result.events = events; // Replace level 1 events with combined events  
    return result;
}

function combineThemes(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_themes = level_one.themes;
    let level_two_themes = level_two.themes;

    if (level_two_themes.length < 1) {
        return result;
    }

    let themes = level_one_themes.concat(level_two_themes); // Store combined themes
    result.themes = themes; // Replace level 1 themes with combined themes
    return result;
}

function combinePrefabs(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_prefabs = level_one.prefabs;
    let level_two_prefabs = level_two.prefabs;

    if (level_two_prefabs.length < 1) {
        return result;
    }

    let prefabs = level_one_prefabs.concat(level_two_prefabs); // Store combined prefabs
    result.prefabs = prefabs; // Replace level 1 prefabs with combined prefabs
    return result;
}

function combinePrefabObjects(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_prefab_objects = level_one.prefab_objects;
    let level_two_prefab_objects = level_two.prefab_objects;

    if (level_two_prefab_objects.length < 1) {
        return result;
    }

    let prefab_objects = level_one_prefab_objects.concat(level_two_prefab_objects); // Store combined prefab objects
    result.prefab_objects = prefab_objects; // Replace level 1 prefab objects with combined prefab objects
    return result;
}

function combineParallax(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_parallax = level_one.parallax_settings.l;
    let level_two_parallax = level_two.parallax_settings.l;

    let parallax = [];
    for (let x = 0; x < level_one_parallax.length; x++) {
        if (parallax[x] !== undefined) {
            parallax[x] = level_one_parallax[x].o.concat(level_two_parallax[x].o);
        }
    }

    parallax = level_one_parallax.concat(level_two_parallax); // Store combined parallax
    result.parallax_settings = parallax; // Replace level 1 parallax with combined parallax
    return result;
}

function combineTriggers(level_one,level_two) {
    let result = level_one; // Set result to level 1, this preserves level 1's editor data and other objects
    let level_one_triggers = level_one.triggers;
    let level_two_triggers = level_two.triggers;

    if (level_two_triggers.length < 1) {
        return result || [];
    }

    let triggers = []
    if (level_two_triggers != undefined) {
        triggers = level_one_triggers || [].concat(level_two_triggers); // Store combined triggers
    }
    result.triggers = triggers; // Replace level 1 triggers with combined triggers
    return result;
}

// magic or some shit
function combineLevels(levelsData) {
    let base_level = JSON.parse(JSON.stringify(levelsData[0].level)); // Make a copy without references to the original

    if (base_level.objects === undefined) { throw new Error('There aren\'t any objects! Something went horribly wrong...'); }
    if (base_level.markers === undefined) { base_level.markers = []; }
    if (base_level.checkpoints === undefined) { throw new Error('Base checkpoint doesn\'t exist! Please make sure all parts have at least one checkpoint (including base checkpoint).'); }
    if (base_level.events === undefined) { throw new Error('Events are improperly defined! Please make sure there\'s at least one of each event keyframe.'); }
    if (base_level.themes === undefined) { base_level.themes = []; }
    if (base_level.prefabs === undefined) { base_level.prefabs = []; }
    if (base_level.prefab_objects === undefined) { base_level.prefab_objects = []; }
    if (base_level.parallax_settings === undefined) { base_level.parallax_settings = {}; }
    if (base_level.triggers === undefined) { base_level.triggers = []; }
    
    for (let x = 1; x < levelsData.length; x++) { // Where things happen
        const level = levelsData[x].level;
        const combineOptions = levelsData[x].combineOptions;
    
        if (combineOptions.objects) { // Let's be real will this ever be off
            if (base_level.objects && level.objects) {
                base_level = combineObjects(base_level, level);
            }
        }
    
        if (combineOptions.markers) {
            if (base_level.markers && level.markers) {
                base_level = combineMarkers(base_level, level);
            }
        }
    
        if (combineOptions.checkpoints) {
            if (base_level.checkpoints && level.checkpoints) {
                base_level = combineCheckpoints(base_level, level);
            }
        }
    
        if (combineOptions.events) {
            if (base_level.events && level.events) {
                base_level = combineEvents(base_level, level);
            }
        }
    
        if (combineOptions.themes) {
            if (base_level.themes && level.themes) {
                base_level = combineThemes(base_level, level);
            }
        }
    
        if (combineOptions.prefabs) {
            if (base_level.prefabs && level.prefabs) {
                base_level = combinePrefabs(base_level, level);
            }
        }
    
        if (combineOptions.unpackedPrefabs) {
            if (base_level.prefab_objects && level.prefab_objects) {
                base_level = combinePrefabObjects(base_level, level);
            }
        }
    
        if (combineOptions.parallaxObjects && false) { // not yet
            if (base_level.parallax_settings.l && level.parallax_settings.l) {
                base_level = combineParallax(base_level, level);
            }
        }
    
        if (combineOptions.triggers) {
            if (base_level.triggers && level.triggers) {
                base_level = combineTriggers(base_level, level);
            }
        }
    }

    return base_level;
}

function uncombineLevel(levelsData) { // evil twin of combineLevels
    const level = JSON.parse(JSON.stringify(levelsData)) // Create a copy without any references
    const metadata = findMetadata(level.level);
    if (!metadata) { throw new Error('Combiner metadata is invalid!'); }
    let parts = splitLevelParts(level, metadata);
    parts = untagLevels(parts);
    return parts;
}