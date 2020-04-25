// ASYNC
const showBreedPage = async () => {
    let d = await query({
        type: 'cat_breed'
    });

    //console.log(d);

    $("#breedPage .breed-list")
        .append()
        .html(makeBreedList(d.result));
}

const showCollectionPage = async (filter) => {
    let filterType, catType;
    console.log(filter);
    switch (filter) {
        case 'ALL':
            filterType = "cat_collection_all";
            break;
        case 'FERAL':
            filterType = "cat_collection_type";
            catType = 0;
            break;
        case 'PET':
            filterType = "cat_collection_type";
            catType = 1;
            break;
    }
    let d = await query({
        type: filterType,
        params: [catType]
    });


    $("#collectPage .collection-list")
        .html(makeCollectionList(d.result));
}

const showProfilePage = async () => {
    let d = await query({
        type: 'user_by_id',
        params: [sessionStorage.userId]
    });

    $("#profileDisplayPage .user-container")
        .html(makeProfileList(d.result));
}
const callCatImg = (id,target)=>{
     query({
         type: 'cat_by_id_image',
         params: [id]
     }).then(d => {
         console.log(d.result.length);
         $(target).html(makeCatImagePage(d.result));
         activeImage();
         makeCatImageButton(d.result.length);
     })
} 
const callCatProfile = (id, target)=>{
    query({
        type:'cat_by_id',
        params:[id]
    }).then(d=>{
       $(target).html(makeCatProfilePage(d.result));
    }).then(d=>{
        callCatMap(sessionStorage.catId, "#catsInfoPage .info-map");
    })
}
const callCatMap =(id,target)=>{
    query({
        type:'locations_from_cat',
        params:[id]
    }).then(async d=>{
        let map_el = await makeMap(target);

        makeMarkers(
            map_el,
            d.result
        );
    })
}

const showcatsInfoPage = async () => {
    if (sessionStorage.catId === undefined) {
        throw ("No animal id defined");
    }
    callCatImg(sessionStorage.catId, "#catsInfoPage .cat-image");
    callCatProfile(sessionStorage.catId, "#catsInfoPage .detail-cat");
};

const showMapPage = async () => {
    let d = await query({
        type: 'recent_cat_locations',
        params: [sessionStorage.userId]
    });
    let cats = d.result.reduce((r,o)=>{
        console.log(o.l_lat)
         //o.icon = o.img;
         o.l_icon = `img/maker/MapMarker.png`;
         
         if(o.l_lat) r.push(o);
         return r;
    },[])    
    let map_el = await makeMap("#mapPage #googleMap");
    makeMarkers(map_el,cats);
}