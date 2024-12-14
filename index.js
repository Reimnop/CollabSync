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

    if (base_level.objects === undefined) { base_level.objects = []; }
    if (base_level.markers === undefined) { base_level.objects = []; }
    if (base_level.checkpoints === undefined) { base_level.checkpoints = [{"ID":"▆3K⁕▥▐8✿BE▧▆g_▤E","n":"Base Checkpoint"}]; }
    if (base_level.events === undefined) { base_level.events = []; }
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
    
        if (combineOptions.parallaxObjects && false) {
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