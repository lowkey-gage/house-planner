(function () {
    var STORAGE_KEY = 'roomBuilder.plan.v3';
    var LEGACY_KEYS = ['roomBuilder.plan.v2', 'roomBuilder.plan.v1'];
    var MIN_ROOM = 6;
    var MIN_SHAPED = 10;
    var MIN_WALL = 1;
    var MAX_ROOM = 209;
    var DOOR_WIDTH = 3;
    var DOOR_REACH = 1.25;
    var PASSAGE = 2;
    var STAIR_W = 3;
    var STAIR_D = 8;
    var STAIR_RISE = 9;
    var MIN_ZOOM = 0.5;
    var MAX_ZOOM = 8;
    var bootCount = 0;

    function piece(id, name, width, depth, color, extra) {
        var item = {
            id: id,
            name: name,
            width: width,
            depth: depth,
            color: color,
            facing: true
        };
        var key;
        if (extra) {
            for (key in extra) {
                if (Object.prototype.hasOwnProperty.call(extra, key)) {
                    item[key] = extra[key];
                }
            }
        }
        return item;
    }

    var flat = { facing: false };
    var round = { facing: false, round: true };
    var rug = { facing: false, kind: 'rug' };
    var bed = { bed: true };

    var ROOMS = [
        {
            id: 'living',
            label: 'Living room',
            pieces: [
                piece('sofa', 'Sofa', 7, 3, '#8d9a84'),
                piece('loveseat', 'Loveseat', 5, 3, '#a3b18a'),
                piece('chair', 'Chair', 3, 3, '#c4a484'),
                piece('accent-chair', 'Accent chair', 2.5, 2.5, '#b08968', { symbol: 'chair' }),
                piece('recliner', 'Recliner', 3, 3.5, '#6b705c', { symbol: 'recliner' }),
                piece('rocking-chair', 'Rocking chair', 2.5, 3, '#a47148', { symbol: 'rocker' }),
                piece('sleeper', 'Sleeper sofa', 7, 3, '#6b7f6a'),
                piece('chaise', 'Sofa chaise', 8, 5, '#7f8f78'),
                piece('sectional', 'Sectional', 9, 6.5, '#5f6f5e'),
                piece('ottoman', 'Ottoman', 3, 2, '#c4a484', { symbol: 'ottoman', facing: false }),
                piece('pouf', 'Pouf', 2, 2, '#ddb892', { symbol: 'pouf', facing: false }),
                piece('bean-bag', 'Bean bag', 3, 3, '#8d9a84', { symbol: 'bean', facing: false }),
                piece('papasan', 'Papasan', 4, 4, '#c4a484', { symbol: 'bean', facing: false }),
                piece('coffee-table', 'Coffee table', 4, 2, '#b08968', flat),
                piece('oval-coffee', 'Oval coffee table', 4, 2, '#c4a484', round),
                piece('nesting-tables', 'Nesting tables', 2.5, 1.5, '#ddb892', { symbol: 'nest', facing: false }),
                piece('side-table', 'Side table', 2, 2, '#ddb892', flat),
                piece('console', 'Console table', 5, 1.5, '#a47148', flat),
                piece('sideboard', 'Sideboard', 6, 1.5, '#7f5539', { symbol: 'doors' }),
                piece('display-cabinet', 'Display cabinet', 3, 1.5, '#6b4f3a', { symbol: 'doors' }),
                piece('bookcase', 'Bookcase', 3, 1, '#7f5539'),
                piece('television', 'Television', 4, 1, '#4a5560', { symbol: 'tv' }),
                piece('tv-unit', 'TV unit', 6, 1.5, '#6b4f3a'),
                piece('media-console', 'Media console', 5, 1.5, '#8a6a4f'),
                piece('curved-sofa', 'Curved sofa', 8, 4, '#7f8f78', { symbol: 'sofa', form: 'curve' }),
                piece('cane-sofa', 'Candy cane sofa', 9, 6, '#5f6f5e', { symbol: 'sofa', form: 'cane' }),
                piece('armless-sofa', 'Armless sofa', 7, 3, '#8d9a84', { symbol: 'sofa' }),
                piece('settee', 'Settee', 4.5, 2.5, '#a3b18a', { symbol: 'sofa' }),
                piece('club-chair', 'Club chair', 3, 3, '#6b5344', { symbol: 'chair' }),
                piece('wing-chair', 'Wing chair', 2.5, 3, '#7f5539', { symbol: 'chair' }),
                piece('floor-cushion', 'Floor cushion', 2, 2, '#c4a484', { symbol: 'pouf', facing: false }),
                piece('gaming-chair', 'Gaming chair', 2.5, 2.5, '#2a3138', { symbol: 'office-chair' }),
                piece('speaker', 'Speaker', 1.5, 1.5, '#2a2420', { symbol: 'box', facing: false }),
                piece('soundbar', 'Soundbar', 4, 1, '#3a3f44', { symbol: 'tv' }),
                piece('record-stand', 'Record stand', 3, 1.5, '#6b4f3a', { symbol: 'shelves' }),
                piece('window-seat', 'Window seat', 5, 2, '#b08968', { symbol: 'bench', facing: false })
            ]
        },
        {
            id: 'bedroom',
            label: 'Bedroom',
            pieces: [
                piece('bed-cal-king', 'Cal-king bed', 6, 7, '#6d8499', { symbol: 'bed', bed: true }),
                piece('bed-king', 'King bed', 6.5, 6.5, '#7e93a8', bed),
                piece('bed-queen', 'Queen bed', 5, 6.5, '#8ea4b8', bed),
                piece('bed-full', 'Full bed', 4.5, 6.5, '#9bb0c2', bed),
                piece('bed-twin', 'Twin bed', 3.5, 6.5, '#b7c6d4', bed),
                piece('bunk-bed', 'Bunk bed', 3.5, 6.5, '#8ea4b8', { symbol: 'bunk' }),
                piece('daybed', 'Daybed', 3.5, 6.5, '#9bb0c2', { symbol: 'daybed' }),
                piece('bench', 'Bench', 4, 1.5, '#c4a484', flat),
                piece('dresser', 'Dresser', 5.5, 1.5, '#8a6a4f'),
                piece('dresser-narrow', 'Narrow dresser', 3, 1.5, '#a47148'),
                piece('chest', 'Chest of drawers', 3.5, 2, '#7f5539', { symbol: 'drawers' }),
                piece('blanket-chest', 'Blanket chest', 4, 2, '#a47148', { symbol: 'chest', facing: false }),
                piece('wardrobe', 'Wardrobe', 4, 2, '#6b5344'),
                piece('jewelry-cabinet', 'Jewelry cabinet', 1.5, 1.5, '#b08968', { symbol: 'doors' }),
                piece('nightstand', 'Nightstand', 2, 1.5, '#6b705c'),
                piece('vanity', 'Vanity', 4, 1.5, '#b08968'),
                piece('vanity-stool', 'Vanity stool', 1.5, 1.5, '#c4a484', { symbol: 'stool', facing: false }),
                piece('floor-mirror', 'Floor mirror', 2, 1, '#c5ced6', { symbol: 'mirror' }),
                piece('hamper', 'Hamper', 1.5, 1.5, '#c4a484', { symbol: 'hamper', facing: false }),
                piece('murphy-bed', 'Murphy bed', 5, 7, '#6d8499', { symbol: 'bed', bed: true }),
                piece('futon', 'Futon', 6.5, 3, '#8d9a84', { symbol: 'sofa' }),
                piece('trundle', 'Trundle bed', 3.5, 6.5, '#9bb0c2', { symbol: 'bed', bed: true }),
                piece('loft-bed', 'Loft bed', 3.5, 6.5, '#7e93a8', { symbol: 'bunk' }),
                piece('armoire', 'Armoire', 4, 2, '#6b5344', { symbol: 'doors' }),
                piece('storage-bench', 'Storage bench', 4, 1.5, '#a47148', { symbol: 'chest', facing: false }),
                piece('split-king', 'Split king bed', 6.5, 6.5, '#7e93a8', { symbol: 'bed', bed: true }),
                piece('hospital-bed', 'Hospital bed', 3.5, 7, '#d6dde4', { symbol: 'bed', bed: true })
            ]
        },
        {
            id: 'dining',
            label: 'Dining',
            pieces: [
                piece('dining-table', 'Dining table', 6, 3.5, '#c08552', flat),
                piece('dining-long', 'Long dining table', 8, 3.5, '#a47148', { symbol: 'table', facing: false }),
                piece('dining-square', 'Square table', 4, 4, '#b08968', flat),
                piece('dining-round', 'Round table', 5, 5, '#ddb892', round),
                piece('high-top', 'High-top table', 3.5, 3.5, '#c4a484', { symbol: 'table-round', facing: false }),
                piece('counter-table', 'Counter table', 5, 2.5, '#b08968', { symbol: 'table', facing: false }),
                piece('dining-chair', 'Dining chair', 1.5, 1.5, '#c4a484'),
                piece('bar-stool', 'Bar stool', 1.5, 1.5, '#a47148'),
                piece('dining-bench', 'Dining bench', 5, 1.5, '#8a6a4f', flat),
                piece('banquette', 'Banquette', 6, 2, '#6b5344', { symbol: 'bench', facing: false }),
                piece('buffet', 'Buffet', 6, 1.5, '#7f5539'),
                piece('bar-cabinet', 'Bar cabinet', 4, 1.5, '#8a6a4f', { symbol: 'doors' }),
                piece('wine-cabinet', 'Wine cabinet', 2, 2, '#6b4f3a', { symbol: 'doors' }),
                piece('bar-cart', 'Bar cart', 2.5, 1.5, '#c08552', { symbol: 'shelves' }),
                piece('china-cabinet', 'China cabinet', 3.5, 1.5, '#6b4f3a'),
                piece('server', 'Server', 5, 1.5, '#7f5539', { symbol: 'doors' }),
                piece('pub-table', 'Pub table', 3, 3, '#c08552', { symbol: 'table-round', facing: false }),
                piece('counter-stool', 'Counter stool', 1.5, 1.5, '#8a6a4f', { symbol: 'stool', facing: false }),
                piece('extendable-table', 'Extendable table', 7, 3.5, '#a47148', { symbol: 'table', facing: false })
            ]
        },
        {
            id: 'office',
            label: 'Office',
            pieces: [
                piece('desk', 'Desk', 5, 2.5, '#9c6644'),
                piece('standing-desk', 'Standing desk', 4.5, 2.5, '#a47148', { symbol: 'desk' }),
                piece('executive-desk', 'Executive desk', 6.5, 3, '#7f5539', { symbol: 'desk' }),
                piece('l-desk', 'L-shape desk', 6, 5, '#7f5539'),
                piece('conference-table', 'Conference table', 8, 4, '#b08968', { symbol: 'table', facing: false }),
                piece('office-chair', 'Office chair', 2, 2, '#6b705c'),
                piece('guest-chair', 'Guest chair', 2, 2, '#c4a484'),
                piece('filing-cabinet', 'Filing cabinet', 1.5, 2, '#8a8175'),
                piece('bookshelf', 'Bookshelf', 3, 1, '#6b5344'),
                piece('bookcase-wide', 'Wide bookcase', 6, 1, '#7f5539', { symbol: 'shelves' }),
                piece('credenza', 'Credenza', 6, 2, '#6b5344', { symbol: 'doors' }),
                piece('whiteboard', 'Whiteboard', 6, 1, '#e7eef3', { symbol: 'board' }),
                piece('printer', 'Printer', 2, 2, '#d6dde4', { symbol: 'printer' }),
                piece('drafting-table', 'Drafting table', 4, 3, '#9c6644', { symbol: 'desk' }),
                piece('laptop-desk', 'Laptop desk', 3, 2, '#b08968', { symbol: 'desk' }),
                piece('corner-bookcase', 'Corner bookcase', 2, 2, '#6b5344', { symbol: 'shelves' }),
                piece('safe', 'Safe', 2, 2, '#3a3f44', { symbol: 'chest', facing: false })
            ]
        },
        {
            id: 'bathroom',
            label: 'Bathroom',
            pieces: [
                piece('toilet', 'Toilet', 1.5, 2.5, '#d6dde4'),
                piece('bidet', 'Bidet', 1.5, 2.5, '#e4eaef', { symbol: 'toilet' }),
                piece('bathtub', 'Bathtub', 5, 2.5, '#c5d0da'),
                piece('corner-tub', 'Corner tub', 5, 5, '#b7c6d4', { symbol: 'bath' }),
                piece('shower', 'Shower', 3, 3, '#b7c4d0', flat),
                piece('corner-shower', 'Corner shower', 3.5, 3.5, '#c5d0da', { symbol: 'shower', facing: false }),
                piece('bath-vanity', 'Vanity', 3, 2, '#b08968'),
                piece('double-vanity', 'Double vanity', 5, 2, '#a47148'),
                piece('pedestal-sink', 'Pedestal sink', 2, 1.5, '#d6dde4', { symbol: 'pedestal' }),
                piece('linen-closet', 'Linen closet', 2, 2, '#8a8175'),
                piece('towel-cabinet', 'Towel cabinet', 2, 1.5, '#a47148', { symbol: 'doors' }),
                piece('bath-scale', 'Bath scale', 1.5, 1.5, '#e7eef3', { symbol: 'box', facing: false }),
                piece('shower-bench', 'Shower bench', 3, 1.5, '#c5d0da', { symbol: 'bench', facing: false }),
                piece('bath-bench', 'Bath bench', 3, 1.5, '#b7c6d4', { symbol: 'bench', facing: false }),
                piece('linen-tower', 'Linen tower', 1.5, 1.5, '#8a8175', { symbol: 'doors' }),
                piece('makeup-vanity', 'Makeup vanity', 4, 1.5, '#b08968', { symbol: 'desk' }),
                piece('towel-ladder', 'Towel ladder', 2, 1, '#a47148', { symbol: 'shelves' })
            ]
        },
        {
            id: 'kitchen',
            label: 'Kitchen',
            pieces: [
                piece('fridge', 'Refrigerator', 3, 3, '#c5ced6'),
                piece('chest-freezer', 'Chest freezer', 5, 2.5, '#d6dde4', { symbol: 'chest', facing: false }),
                piece('wine-cooler', 'Wine cooler', 2, 2, '#b7c6d4', { symbol: 'fridge' }),
                piece('range', 'Range', 2.5, 2.5, '#8a8175'),
                piece('cooktop', 'Cooktop', 3, 2, '#5c564c', { symbol: 'range' }),
                piece('wall-oven', 'Wall oven', 2.5, 2.5, '#8a8175', { symbol: 'oven' }),
                piece('microwave', 'Microwave', 2, 1.5, '#c5ced6', { symbol: 'microwave' }),
                piece('dishwasher', 'Dishwasher', 2, 2, '#d6dde4'),
                piece('sink-base', 'Sink base', 3, 2, '#7f5539', { symbol: 'sink' }),
                piece('double-sink', 'Double sink', 5, 2, '#6b5344', { symbol: 'sink2' }),
                piece('island', 'Island', 6, 3, '#c08552', flat),
                piece('peninsula', 'Peninsula', 7, 3, '#b08968', { symbol: 'island', facing: false }),
                piece('prep-table', 'Prep table', 4, 2, '#ddb892', { symbol: 'table', facing: false }),
                piece('base-cabinet', 'Base cabinet', 6, 2, '#7f5539'),
                piece('wall-cabinet', 'Wall cabinet', 4, 1, '#8a6a4f', { symbol: 'doors' }),
                piece('pantry', 'Pantry', 3, 2, '#6b4f3a', { symbol: 'doors' }),
                piece('trash-cabinet', 'Trash cabinet', 1.5, 2, '#a47148', { symbol: 'doors' }),
                piece('utility-cart', 'Utility cart', 2.5, 1.5, '#c08552', { symbol: 'shelves' }),
                piece('trash-can', 'Trash can', 1.5, 1.5, '#8a8175', { symbol: 'hamper', facing: false }),
                piece('recycling-bin', 'Recycling bin', 1.5, 1.5, '#7e93a8', { symbol: 'box', facing: false }),
                piece('french-fridge', 'French door fridge', 3, 3, '#d6dde4', { symbol: 'fridge' }),
                piece('side-fridge', 'Side-by-side fridge', 3.5, 3, '#c5ced6', { symbol: 'fridge' }),
                piece('ice-maker', 'Ice maker', 1.5, 2, '#e7eef3', { symbol: 'fridge' }),
                piece('coffee-bar', 'Coffee bar', 4, 2, '#7f5539', { symbol: 'island', facing: false }),
                piece('bakers-rack', 'Baker\'s rack', 3, 1.5, '#a47148', { symbol: 'shelves' }),
                piece('butcher-block', 'Butcher block', 3, 2, '#c08552', { symbol: 'table', facing: false }),
                piece('kitchen-table', 'Kitchen table', 4, 3, '#b08968', { symbol: 'table', facing: false })
            ]
        },
        {
            id: 'nursery',
            label: 'Nursery',
            pieces: [
                piece('crib', 'Crib', 3, 5, '#d4b483', bed),
                piece('bassinet', 'Bassinet', 2, 3.5, '#e6c8a0', { symbol: 'crib' }),
                piece('toddler-bed', 'Toddler bed', 3, 5, '#b7c6d4', { symbol: 'bed', bed: true }),
                piece('changing-table', 'Changing table', 3.5, 2, '#ddb892'),
                piece('nursery-dresser', 'Nursery dresser', 3.5, 1.5, '#c4a484', { symbol: 'drawers' }),
                piece('glider', 'Glider', 2.5, 3, '#8d9a84', { symbol: 'rocker' }),
                piece('high-chair', 'High chair', 1.5, 2, '#ddb892', { symbol: 'highchair' }),
                piece('kids-table', 'Kids table', 3, 3, '#e6c8a0', { symbol: 'table', facing: false }),
                piece('kids-chair', 'Kids chair', 1.5, 1.5, '#c4a484', { symbol: 'side-chair' }),
                piece('toy-chest', 'Toy chest', 3, 1.5, '#c4a484', flat),
                piece('toy-shelf', 'Toy shelf', 3, 1, '#a47148', { symbol: 'shelves' }),
                piece('play-mat', 'Play mat', 5, 4, '#e6c8a0', rug),
                piece('nursing-chair', 'Nursing chair', 2.5, 3, '#8d9a84', { symbol: 'rocker' }),
                piece('kids-sofa', 'Kids sofa', 4.5, 2.5, '#d4b483', { symbol: 'sofa' }),
                piece('kids-bookcase', 'Kids bookcase', 2.5, 1, '#a47148', { symbol: 'shelves' })
            ]
        },
        {
            id: 'outdoor',
            label: 'Outdoor',
            pieces: [
                piece('outdoor-sectional', 'Outdoor sectional', 8, 6, '#6b7f6a'),
                piece('outdoor-sofa', 'Outdoor sofa', 6.5, 3, '#8d9a84', { symbol: 'sofa' }),
                piece('lounge-chair', 'Lounge chair', 2.5, 5, '#8d9a84'),
                piece('patio-chair', 'Patio chair', 2.5, 2.5, '#a3b18a', { symbol: 'chair' }),
                piece('adirondack', 'Adirondack', 2.5, 3, '#6b7f6a', { symbol: 'chair' }),
                piece('outdoor-bench', 'Outdoor bench', 5, 1.5, '#7f5539', { symbol: 'bench', facing: false }),
                piece('porch-swing', 'Porch swing', 5, 2.5, '#8a6a4f', { symbol: 'bench', facing: false }),
                piece('outdoor-table', 'Outdoor table', 5, 3, '#b08968', flat),
                piece('umbrella-table', 'Umbrella table', 4, 4, '#ddb892', { symbol: 'table-round', facing: false }),
                piece('picnic-table', 'Picnic table', 5, 6, '#a47148', { symbol: 'picnic', facing: false }),
                piece('grill', 'Grill', 3, 2, '#5c564c'),
                piece('smoker', 'Smoker', 2, 3, '#3a3f44', { symbol: 'grill' }),
                piece('cooler', 'Cooler', 2.5, 1.5, '#7e93a8', { symbol: 'chest', facing: false }),
                piece('planter', 'Planter', 4, 1.5, '#6b5344', { symbol: 'planter', facing: false }),
                piece('fire-pit', 'Fire pit', 3, 3, '#8a6a4f', round),
                piece('hot-tub', 'Hot tub', 7, 7, '#7e93a8', round),
                piece('hammock', 'Hammock', 3, 7, '#c4a484', { symbol: 'hammock', facing: false }),
                piece('outdoor-rug', 'Outdoor rug', 8, 6, '#6b7f6a', { symbol: 'rug', kind: 'rug', facing: false }),
                piece('curved-outdoor', 'Curved outdoor sofa', 8, 4, '#6b7f6a', { symbol: 'sofa', form: 'curve' }),
                piece('cane-outdoor', 'Candy cane outdoor sofa', 8, 6, '#5f6f5e', { symbol: 'sofa', form: 'cane' }),
                piece('patio-umbrella', 'Patio umbrella', 7, 7, '#e6c8a0', { symbol: 'table-round', facing: false }),
                piece('porch-rocker', 'Porch rocker', 2.5, 3, '#7f5539', { symbol: 'rocker' }),
                piece('outdoor-daybed', 'Outdoor daybed', 3.5, 7, '#8d9a84', { symbol: 'daybed' }),
                piece('outdoor-kitchen', 'Outdoor kitchen', 6, 2.5, '#6b5344', { symbol: 'island', facing: false }),
                piece('swing-set', 'Swing set', 8, 6, '#a47148', { symbol: 'swing', facing: false })
            ]
        },
        {
            id: 'accessories',
            label: 'Accessories',
            pieces: [
                piece('rug', 'Rug', 8, 5, '#d4b483', rug),
                piece('small-rug', 'Small rug', 5, 3, '#e6c8a0', rug),
                piece('runner', 'Runner', 8, 2.5, '#c4a484', { symbol: 'rug', kind: 'rug', facing: false }),
                piece('round-rug', 'Round rug', 6, 6, '#d4b483', { symbol: 'rug-round', kind: 'rug', facing: false }),
                piece('plant-large', 'Large plant', 2, 2, '#6b7f6a', round),
                piece('plant-small', 'Small plant', 1, 1, '#8d9a84', round),
                piece('floor-lamp', 'Floor lamp', 1, 1, '#c4a484', round),
                piece('table-lamp', 'Table lamp', 1, 1, '#ddb892', { symbol: 'lamp', facing: false }),
                piece('arc-lamp', 'Arc lamp', 3, 3, '#c4a484', { symbol: 'lamp', facing: false }),
                piece('fireplace', 'Fireplace', 5, 1.5, '#6b4f3a'),
                piece('wood-stove', 'Wood stove', 2, 2, '#3a3f44', { symbol: 'stove' }),
                piece('radiator', 'Radiator', 4, 1, '#c5ced6', { symbol: 'radiator' }),
                piece('room-divider', 'Room divider', 5, 1, '#e6c8a0', { symbol: 'divider' }),
                piece('entry-bench', 'Entry bench', 4, 1.5, '#b08968', { symbol: 'bench', facing: false }),
                piece('coat-rack', 'Coat rack', 1.5, 1.5, '#7f5539', { symbol: 'coat', facing: false }),
                piece('shoe-cabinet', 'Shoe cabinet', 3, 1, '#8a6a4f', { symbol: 'drawers' }),
                piece('shoe-rack', 'Shoe rack', 3, 1, '#a47148', { symbol: 'shelves' }),
                piece('entry-mirror', 'Entry mirror', 3, 1, '#d6dde4', { symbol: 'mirror' }),
                piece('aquarium', 'Aquarium', 4, 1.5, '#1f4e5f', { symbol: 'aquarium' }),
                piece('dog-bed', 'Dog bed', 3, 2, '#c4a484', { symbol: 'dogbed', facing: false }),
                piece('dog-crate', 'Dog crate', 3, 2, '#8a8175', { symbol: 'crate' }),
                piece('cat-tree', 'Cat tree', 2, 2, '#a47148', { symbol: 'cat', facing: false }),
                piece('litter-box', 'Litter box', 1.5, 2, '#e6c8a0', { symbol: 'box', facing: false }),
                piece('basket', 'Basket', 1.5, 1.5, '#ddb892', { symbol: 'hamper', facing: false }),
                piece('trunk', 'Trunk', 3, 1.5, '#6b5344', { symbol: 'chest', facing: false }),
                piece('square-rug', 'Square rug', 8, 8, '#d4b483', rug),
                piece('large-rug', 'Large rug', 12, 9, '#c4a484', rug),
                piece('oval-rug', 'Oval rug', 8, 5, '#e6c8a0', { symbol: 'rug-round', kind: 'rug', facing: false }),
                piece('hide-rug', 'Hide rug', 5, 6, '#ddb892', rug),
                piece('hall-tree', 'Hall tree', 3, 1.5, '#7f5539', { symbol: 'coat', facing: false }),
                piece('umbrella-stand', 'Umbrella stand', 1, 1, '#6b5344', { symbol: 'box', facing: false })
            ]
        },
        {
            id: 'laundry',
            label: 'Laundry',
            pieces: [
                piece('washer', 'Washer', 2.5, 2.5, '#d6dde4', { symbol: 'washer' }),
                piece('dryer', 'Dryer', 2.5, 2.5, '#e7eef3', { symbol: 'dryer' }),
                piece('stacked-laundry', 'Stacked washer', 2.5, 2.5, '#c5ced6', { symbol: 'washer' }),
                piece('laundry-sink', 'Laundry sink', 2.5, 2, '#b08968', { symbol: 'sink' }),
                piece('folding-table', 'Folding table', 5, 2, '#ddb892', { symbol: 'table', facing: false }),
                piece('ironing-board', 'Ironing board', 1.5, 5, '#e6c8a0', { symbol: 'iron' }),
                piece('utility-cabinet', 'Utility cabinet', 3, 2, '#8a6a4f', { symbol: 'doors' }),
                piece('laundry-hamper', 'Laundry hamper', 2, 1.5, '#c4a484', { symbol: 'hamper', facing: false }),
                piece('drying-rack', 'Drying rack', 4, 1.5, '#e6c8a0', { symbol: 'divider' }),
                piece('laundry-sorter', 'Laundry sorter', 2, 1.5, '#c4a484', { symbol: 'hamper', facing: false })
            ]
        },
        {
            id: 'fitness',
            label: 'Fitness',
            pieces: [
                piece('treadmill', 'Treadmill', 3, 6, '#5c564c', { symbol: 'treadmill' }),
                piece('exercise-bike', 'Exercise bike', 2, 3.5, '#3a3f44', { symbol: 'bike' }),
                piece('elliptical', 'Elliptical', 2.5, 5, '#8a8175', { symbol: 'bike' }),
                piece('rower', 'Rowing machine', 2, 8, '#6b5344', { symbol: 'rower' }),
                piece('weight-bench', 'Weight bench', 2.5, 5, '#2a3138', { symbol: 'weights' }),
                piece('yoga-mat', 'Yoga mat', 2, 6, '#6b7f6a', { symbol: 'rug', kind: 'rug', facing: false }),
                piece('dumbbell-rack', 'Dumbbell rack', 3, 1.5, '#5c564c', { symbol: 'shelves' }),
                piece('power-rack', 'Power rack', 4, 4, '#2a3138', { symbol: 'shelves' }),
                piece('punching-bag', 'Punching bag', 2, 2, '#6b5344', { symbol: 'box', facing: false }),
                piece('sauna', 'Sauna', 5, 4, '#c4a484', { symbol: 'box', facing: false })
            ]
        },
        {
            id: 'games',
            label: 'Games',
            pieces: [
                piece('pool-table', 'Pool table', 5, 9, '#2f6b45', { symbol: 'pool', facing: false }),
                piece('ping-pong', 'Ping-pong', 5, 9, '#3d6f8a', { symbol: 'pingpong', facing: false }),
                piece('foosball', 'Foosball', 4, 6, '#c08552', { symbol: 'foosball', facing: false }),
                piece('upright-piano', 'Upright piano', 5, 2, '#2a2420', { symbol: 'piano' }),
                piece('grand-piano', 'Grand piano', 5, 6.5, '#2a2420', { symbol: 'grand' }),
                piece('keyboard', 'Keyboard', 4.5, 1.5, '#3a3f44', { symbol: 'keyboard' }),
                piece('easel', 'Easel', 2, 2, '#ddb892', { symbol: 'easel' }),
                piece('air-hockey', 'Air hockey', 4, 7, '#d6dde4', { symbol: 'pingpong', facing: false }),
                piece('arcade', 'Arcade cabinet', 2.5, 3, '#2a2420', { symbol: 'doors' }),
                piece('drum-kit', 'Drum kit', 5, 5, '#c5ced6', { symbol: 'table-round', facing: false }),
                piece('guitar-amp', 'Guitar amp', 1.5, 1.5, '#3a3f44', { symbol: 'box', facing: false }),
                piece('sewing-table', 'Sewing table', 4, 2, '#ddb892', { symbol: 'desk' }),
                piece('craft-table', 'Craft table', 5, 3, '#c4a484', { symbol: 'table', facing: false })
            ]
        },
        {
            id: 'utility',
            label: 'Utility',
            pieces: [
                piece('workbench', 'Workbench', 6, 2.5, '#8a6a4f', { symbol: 'desk' }),
                piece('tool-chest', 'Tool chest', 4, 2, '#5c564c', { symbol: 'drawers' }),
                piece('water-heater', 'Water heater', 2, 2, '#c5ced6', { symbol: 'box', facing: false }),
                piece('furnace', 'Furnace', 2.5, 2.5, '#8a8175', { symbol: 'box', facing: false }),
                piece('garage-shelf', 'Garage shelf', 6, 2, '#7f5539', { symbol: 'shelves' }),
                piece('bicycle', 'Bicycle', 2, 6, '#3a3f44', { symbol: 'bike' }),
                piece('lawn-mower', 'Lawn mower', 2, 4, '#5c564c', { symbol: 'box', facing: false }),
                piece('riding-mower', 'Riding mower', 3.5, 5, '#6b7f6a', { symbol: 'box', facing: false }),
                piece('car', 'Car', 6, 12, '#7e93a8', { symbol: 'car', facing: false }),
                piece('truck', 'Truck', 6.5, 12, '#5c564c', { symbol: 'car', facing: false }),
                piece('motorcycle', 'Motorcycle', 2.5, 7, '#2a2420', { symbol: 'bike' }),
                piece('generator', 'Generator', 2, 3, '#8a8175', { symbol: 'box', facing: false })
            ]
        },
        {
            id: 'basement',
            label: 'Basement',
            pieces: [
                piece('cellar-access', 'Cellar access', 4, 3, '#6b5344', { symbol: 'cellar', facing: false })
            ]
        }
    ];

    if (typeof SweetHomeFurniture !== 'undefined' && SweetHomeFurniture.length) {
        ROOMS.push({
            id: 'library',
            label: 'Library',
            pieces: SweetHomeFurniture.map(function (item) {
                var extra = {
                    symbol: item.symbol,
                    height: item.height,
                    tags: item.tags,
                    library: true
                };
                if (item.rug) {
                    extra.kind = 'rug';
                    extra.facing = false;
                }
                if (item.symbol === 'bed' || item.symbol === 'bunk') {
                    extra.bed = true;
                }
                if (item.symbol === 'table' || item.symbol === 'table-round') {
                    extra.facing = false;
                }
                return piece(item.id, item.name, item.width, item.depth, item.color, extra);
            })
        });
    }

    designateHeights();

    var SHAPES = [
        { id: 'rectangle', label: 'Rectangle', kind: 'rect', width: 12, depth: 14 },
        { id: 'square', label: 'Square', kind: 'rect', width: 12, depth: 12 },
        { id: 'l', label: 'L-shape', kind: 'l', width: 18, depth: 16, cutW: 8, cutD: 8 },
        { id: 'l2', label: 'L-shape 2', kind: 'l2', width: 18, depth: 16, cutW: 8, cutD: 8 },
        { id: 't', label: 'T-shape', kind: 't', width: 18, depth: 16, cutW: 8, cutD: 6 },
        { id: 'studio', label: 'Studio', kind: 'rect', width: 20, depth: 14 },
        { id: 'custom', label: 'Custom', kind: 'custom' }
    ];

    var WALL_PIECES = [2, 6];

    function allPieces() {
        var list = [];
        ROOMS.forEach(function (room) {
            room.pieces.forEach(function (entry) {
                list.push(entry);
            });
        });
        return list;
    }

    function parseSearch(query) {
        var text = String(query || '').trim().toLowerCase();
        var match = text.match(/(\d+(?:\.\d+)?)\s*(?:x|×|by)\s*(\d+(?:\.\d+)?)\s*$/);
        var size = null;
        if (match) {
            size = {
                width: snap(parseFloat(match[1])),
                depth: snap(parseFloat(match[2]))
            };
            text = text.slice(0, match.index).trim();
        }
        return { text: text, size: size };
    }

    function catalogItem(id) {
        var roomIndex;
        var pieceIndex;
        for (roomIndex = 0; roomIndex < ROOMS.length; roomIndex += 1) {
            for (pieceIndex = 0; pieceIndex < ROOMS[roomIndex].pieces.length; pieceIndex += 1) {
                if (ROOMS[roomIndex].pieces[pieceIndex].id === id) {
                    return ROOMS[roomIndex].pieces[pieceIndex];
                }
            }
        }
        return null;
    }

    function roomTab(id) {
        var index;
        for (index = 0; index < ROOMS.length; index += 1) {
            if (ROOMS[index].id === id) {
                return ROOMS[index];
            }
        }
        return ROOMS[0];
    }

    function shapeTemplate(id) {
        var index;
        for (index = 0; index < SHAPES.length; index += 1) {
            if (SHAPES[index].id === id) {
                return SHAPES[index];
            }
        }
        return SHAPES[0];
    }

    function snap(value) {
        return Math.round(value * 2) / 2;
    }

    function num(value) {
        return String(Math.round(value * 1000) / 1000);
    }

    function formatFeet(value) {
        return String(snap(value));
    }

    function normalizeRotation(value) {
        var rotation = Math.round(Number(value));
        if (!isFinite(rotation)) {
            return 0;
        }
        return ((rotation % 360) + 360) % 360;
    }

    function sizeLimits(entry) {
        var symbol = symbolFor(entry);
        var tight = {
            toilet: true,
            fridge: true,
            range: true,
            oven: true,
            microwave: true,
            dishwasher: true,
            washer: true,
            piano: true,
            grand: true,
            keyboard: true,
            pool: true,
            pingpong: true,
            foosball: true,
            bike: true,
            rower: true,
            treadmill: true,
            printer: true,
            easel: true,
            aquarium: true,
            highchair: true,
            pedestal: true,
            mirror: true,
            lamp: true,
            stove: true
        };
        var minW;
        var maxW;
        var minD;
        var maxD;
        if (tight[symbol]) {
            minW = snap(Math.max(1, entry.width - 0.5));
            maxW = snap(entry.width + 0.5);
            minD = snap(Math.max(1, entry.depth - 0.5));
            maxD = snap(entry.depth + 0.5);
        } else if (symbol === 'rug' || symbol === 'rug-round') {
            minW = 2;
            maxW = 40;
            minD = 2;
            maxD = 40;
        } else if (symbol === 'sofa' || symbol === 'sectional' || symbol === 'chaise') {
            minW = 3;
            maxW = 20;
            minD = 2;
            maxD = 10;
        } else if (symbol === 'bed') {
            minW = 2.5;
            maxW = 8;
            minD = 4;
            maxD = 9;
        } else if (symbol === 'table' || symbol === 'table-round') {
            minW = 1.5;
            maxW = 16;
            minD = 1.5;
            maxD = 16;
        } else {
            minW = Math.max(1, snap(entry.width * 0.5));
            maxW = Math.max(16, snap(entry.width + 6));
            minD = Math.max(1, snap(entry.depth * 0.5));
            maxD = Math.max(10, snap(entry.depth + 4));
        }
        return {
            minW: Math.min(minW, entry.width),
            maxW: Math.max(maxW, entry.width),
            minD: Math.min(minD, entry.depth),
            maxD: Math.max(maxD, entry.depth),
            tight: !!tight[symbol]
        };
    }

    function placedSize(item) {
        var entry = catalogItem(item.catalogId);
        var limits = sizeLimits(entry);
        var width = entry.width;
        var depth = entry.depth;
        if (item && isFinite(Number(item.width))) {
            width = Number(item.width);
        }
        if (item && isFinite(Number(item.depth))) {
            depth = Number(item.depth);
        }
        return {
            entry: entry,
            limits: limits,
            width: snap(Math.min(limits.maxW, Math.max(limits.minW, width))),
            depth: snap(Math.min(limits.maxD, Math.max(limits.minD, depth)))
        };
    }

    function drawingEntry(item) {
        var size = placedSize(item);
        var entry = size.entry;
        var copy;
        var key;
        var form = item && item.form ? item.form : (entry.form || '');
        if (entry.width === size.width && entry.depth === size.depth && form === (entry.form || '')) {
            return entry;
        }
        copy = {};
        for (key in entry) {
            if (Object.prototype.hasOwnProperty.call(entry, key)) {
                copy[key] = entry[key];
            }
        }
        copy.width = size.width;
        copy.depth = size.depth;
        if (form && form !== (entry.form || '')) {
            copy.form = form;
        }
        return copy;
    }

    function localParts(entry, width, depth) {
        var form = entry && entry.form ? entry.form : '';
        var symbol = entry ? symbolFor(entry) : '';
        var measures;
        if (form === 'straight') {
            return [{ x: 0, y: 0, w: width, d: depth }];
        }
        if (form === 'curve') {
            return [
                { x: 0, y: depth * 0.2, w: width * 0.42, d: depth * 0.48 },
                { x: width * 0.18, y: 0, w: width * 0.64, d: depth * 0.7 },
                { x: width * 0.58, y: depth * 0.2, w: width * 0.42, d: depth * 0.48 }
            ];
        }
        if (form === 'cane' || symbol === 'chaise') {
            measures = runMeasures(width, depth);
            return [
                { x: 0, y: 0, w: width, d: measures.seat },
                { x: width - measures.arm, y: 0, w: measures.arm, d: depth }
            ];
        }
        if (symbol === 'sectional') {
            measures = runMeasures(width, depth);
            return [
                { x: 0, y: 0, w: width, d: measures.seat },
                { x: 0, y: 0, w: measures.arm, d: depth }
            ];
        }
        return [{ x: 0, y: 0, w: width, d: depth }];
    }

    function worldAabb(item, width, depth, part) {
        var rad = ((Number(item.rotation) || 0) * Math.PI) / 180;
        var cosine = Math.cos(rad);
        var sine = Math.sin(rad);
        var box = footprint(item);
        var cx = item.x + box.w / 2;
        var cy = item.y + box.d / 2;
        var corners = [
            [part.x, part.y],
            [part.x + part.w, part.y],
            [part.x, part.y + part.d],
            [part.x + part.w, part.y + part.d]
        ];
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        corners.forEach(function (corner) {
            var dx = corner[0] - width / 2;
            var dy = corner[1] - depth / 2;
            var x = cx + dx * cosine - dy * sine;
            var y = cy + dx * sine + dy * cosine;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
        return { x: minX, y: minY, w: Math.max(0.1, maxX - minX), d: Math.max(0.1, maxY - minY) };
    }

    function occupiedWorld(item) {
        var drawn = drawingEntry(item);
        var size = placedSize(item);
        return localParts(drawn, size.width, size.depth).map(function (part) {
            return worldAabb(item, size.width, size.depth, part);
        });
    }

    function footprint(item) {
        var size = placedSize(item);
        var rad = ((Number(item.rotation) || 0) * Math.PI) / 180;
        var cosine = Math.abs(Math.cos(rad));
        var sine = Math.abs(Math.sin(rad));
        return {
            w: size.width * cosine + size.depth * sine,
            d: size.width * sine + size.depth * cosine
        };
    }

    function rotateHandlePoint(item) {
        var size = footprint(item);
        var cx = item.x + size.w / 2;
        var cy = item.y + size.d / 2;
        var rad = ((Number(item.rotation) || 0) * Math.PI) / 180;
        var reach = Math.sqrt(size.w * size.w + size.d * size.d) / 2 + 0.55;
        return {
            x: cx + Math.sin(rad) * reach,
            y: cy - Math.cos(rad) * reach
        };
    }

    function itemTransform(item) {
        var size = placedSize(item);
        var box = footprint(item);
        var cx = item.x + box.w / 2;
        var cy = item.y + box.d / 2;
        return 'translate(' + num(cx) + ' ' + num(cy) + ') rotate(' + (item.rotation || 0) + ') translate(' + num(-size.width / 2) + ' ' + num(-size.depth / 2) + ')';
    }

    function tint(hex, amount) {
        var h = String(hex || '#b7a99a').replace('#', '');
        var target = amount > 0 ? 255 : 0;
        var mix = Math.abs(amount);
        var channels = [0, 2, 4].map(function (start) {
            var value = parseInt(h.substr(start, 2), 16);
            return Math.max(0, Math.min(255, Math.round(value + (target - value) * mix)));
        });
        return 'rgb(' + channels.join(',') + ')';
    }

    var MAT = {
        wood: '#8d5a32',
        woodDark: '#3f2918',
        linen: '#f7f3ec',
        metal: '#d5dbe1',
        metalDark: '#4e575f',
        glass: '#1b242c',
        glassLite: '#d5e2ea',
        stone: '#e6e1d8',
        porcelain: '#f7f8f8',
        water: '#d4e3ea',
        ink: '#2a2724'
    };

    var BOOK_TONES = ['#f4efe6', '#8c3d2f', '#2f4a3c', '#d4b483', '#243044'];

    function furnRect(x, y, w, h, fill, rx, stroke, sw) {
        if (w < 0.04 || h < 0.04) {
            return '';
        }
        var line = stroke ? ' stroke="' + stroke + '" stroke-width="' + num(sw || 0.03) + '"' : '';
        return '<rect pointer-events="none" x="' + num(x) + '" y="' + num(y) + '" width="' + num(w) + '" height="' + num(h) + '" rx="' + num(rx || 0) + '" fill="' + fill + '"' + line + '></rect>';
    }

    function furnOval(cx, cy, rx, ry, fill) {
        if (rx < 0.03 || ry < 0.03) {
            return '';
        }
        return '<ellipse pointer-events="none" cx="' + num(cx) + '" cy="' + num(cy) + '" rx="' + num(rx) + '" ry="' + num(ry) + '" fill="' + fill + '"></ellipse>';
    }

    function furnBody(w, d, fill, stroke, sw, round) {
        if (round) {
            return '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(Math.max(w / 2 - 0.02, 0.05)) + '" ry="' + num(Math.max(d / 2 - 0.02, 0.05)) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        }
        return '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" rx="0.08" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
    }

    function partGroup(inner) {
        return '<g pointer-events="none">' + inner + '</g>';
    }

    function partKnob(x, y) {
        return furnOval(x, y, 0.075, 0.075, MAT.metal) + furnOval(x, y, 0.03, 0.03, MAT.metalDark);
    }

    function partLegs(w, d) {
        var leg = Math.min(0.18, w * 0.1, d * 0.12);
        var inset = 0.06;
        return furnRect(inset, inset, leg, leg, MAT.ink, 0.02) +
            furnRect(w - leg - inset, inset, leg, leg, MAT.ink, 0.02) +
            furnRect(inset, d - leg - inset, leg, leg, MAT.ink, 0.02) +
            furnRect(w - leg - inset, d - leg - inset, leg, leg, MAT.ink, 0.02);
    }

    function partWoodTop(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        markup += partGroup(furnRect(0.11, 0.11, w - 0.22, d - 0.22, color, 0.03) + partLegs(w, d));
        return markup;
    }

    function partDeck(w, d) {
        var height = Math.min(0.2, Math.max(0.1, d * 0.14));
        return furnRect(0.1, 0.07, w - 0.2, height, MAT.glass, 0.02);
    }

    function partPull(w, d) {
        if (d < 0.7) {
            return '';
        }
        return furnRect(w * 0.26, d - 0.16, w * 0.48, 0.07, MAT.metal, 0.03);
    }

    function symbolFor(entry) {
        var id = entry.id;
        if (entry.symbol) {
            return entry.symbol;
        }
        if (entry.kind === 'rug') {
            return 'rug';
        }
        if (id === 'crib') {
            return 'crib';
        }
        if (entry.bed) {
            return 'bed';
        }
        if (id === 'floor-lamp') {
            return 'lamp';
        }
        if (id.indexOf('plant') === 0) {
            return 'plant';
        }
        if (id === 'fire-pit') {
            return 'fire';
        }
        if (id === 'hot-tub') {
            return 'hottub';
        }
        if (id === 'oval-coffee' || id === 'dining-round') {
            return 'table-round';
        }
        if (id === 'sectional' || id === 'outdoor-sectional') {
            return 'sectional';
        }
        if (id === 'chaise') {
            return 'chaise';
        }
        if (id === 'lounge-chair') {
            return 'lounge';
        }
        if (id === 'sofa' || id === 'loveseat' || id === 'sleeper' || id === 'chair') {
            return id === 'chair' ? 'chair' : 'sofa';
        }
        if (id === 'bench' || id === 'dining-bench') {
            return 'bench';
        }
        if (id === 'coffee-table' || id === 'side-table' || id === 'console' || id === 'dining-table' || id === 'dining-square' || id === 'outdoor-table') {
            return 'table';
        }
        if (id === 'bookcase' || id === 'bookshelf') {
            return 'shelves';
        }
        if (id === 'china-cabinet') {
            return 'doors';
        }
        if (id === 'tv-unit' || id === 'media-console') {
            return 'tv';
        }
        if (id === 'dresser' || id === 'dresser-narrow' || id === 'nightstand' || id === 'filing-cabinet' || id === 'toy-chest') {
            return 'drawers';
        }
        if (id === 'wardrobe' || id === 'linen-closet' || id === 'buffet' || id === 'base-cabinet') {
            return 'doors';
        }
        if (id === 'dining-chair' || id === 'guest-chair') {
            return 'side-chair';
        }
        if (id === 'bar-stool') {
            return 'stool';
        }
        if (id === 'office-chair') {
            return 'office-chair';
        }
        if (id === 'desk' || id === 'vanity') {
            return 'desk';
        }
        if (id === 'l-desk') {
            return 'ldesk';
        }
        if (id === 'toilet') {
            return 'toilet';
        }
        if (id === 'bathtub') {
            return 'bath';
        }
        if (id === 'shower') {
            return 'shower';
        }
        if (id === 'bath-vanity') {
            return 'sink';
        }
        if (id === 'double-vanity') {
            return 'sink2';
        }
        if (id === 'fridge') {
            return 'fridge';
        }
        if (id === 'range') {
            return 'range';
        }
        if (id === 'dishwasher') {
            return 'dishwasher';
        }
        if (id === 'island') {
            return 'island';
        }
        if (id === 'changing-table') {
            return 'changing';
        }
        if (id === 'grill') {
            return 'grill';
        }
        if (id === 'fireplace') {
            return 'fireplace';
        }
        return 'plain';
    }

    function pieceProfile(entry) {
        var name = String(entry.name || '').toLowerCase();
        var id = entry.id || '';
        var symbol = symbolFor(entry);
        var height = 3;
        var base = 0;
        if (entry.kind === 'rug' || symbol === 'rug' || symbol === 'rug-round') {
            return { height: 0.1, base: 0 };
        }
        if (symbol === 'cellar' || id === 'cellar-access') {
            return { height: 0.3, base: 0 };
        }
        if (/upper cabinet|wall cabinet/.test(name)) {
            return { height: 2.5, base: 4.5 };
        }
        if (/pendant/.test(name)) {
            return { height: 1.5, base: 5 };
        }
        if (symbol === 'board') {
            return { height: 4, base: 3 };
        }
        if (/soundbar/.test(name)) {
            return { height: 0.5, base: 2.2 };
        }
        if (id === 'television' || /flat tv/.test(name)) {
            return { height: 2.5, base: 2.5 };
        }
        if (id === 'entry-mirror') {
            return { height: 3, base: 3.5 };
        }
        if (symbol === 'microwave' || /microwave/.test(name)) {
            return { height: 1.2, base: 3 };
        }
        if (id === 'wall-oven' || /wall oven/.test(name)) {
            return { height: 2.5, base: 1.5 };
        }
        if (/coffee|nesting/.test(name)) {
            height = 1.5;
        } else if (/side table/.test(name)) {
            height = 2;
        } else if (/console/.test(name)) {
            height = 2.8;
        } else if (/nightstand|bedside/.test(name)) {
            height = 2;
        } else if (/high-top/.test(name)) {
            height = 3.5;
        } else if (/bar stool|counter stool/.test(name)) {
            height = 3;
        } else if (/vanity stool/.test(name)) {
            height = 1.5;
        } else if (/standing desk/.test(name)) {
            height = 4;
        } else if (/floor lamp|arc lamp|uplight/.test(name)) {
            height = 5.5;
        } else if (/table lamp/.test(name)) {
            height = 1.5;
        } else if (/floor mirror/.test(name)) {
            height = 5.5;
        } else if (/large plant/.test(name)) {
            height = 5;
        } else if (/small plant/.test(name)) {
            height = 1.5;
        } else if (/bunk|loft/.test(name)) {
            height = 5.5;
        } else if (/crib|bassinet/.test(name)) {
            height = 3;
        } else if (/murphy/.test(name)) {
            height = 7;
        } else if (symbol === 'sofa' || symbol === 'sectional' || symbol === 'chaise') {
            height = 2.8;
        } else if (symbol === 'chair' || symbol === 'side-chair') {
            height = 3;
        } else if (symbol === 'recliner' || symbol === 'rocker') {
            height = 3.3;
        } else if (symbol === 'lounge') {
            height = 2.5;
        } else if (symbol === 'office-chair') {
            height = 3.5;
        } else if (symbol === 'stool') {
            height = 2.5;
        } else if (symbol === 'ottoman') {
            height = 1.4;
        } else if (symbol === 'pouf') {
            height = 1.1;
        } else if (symbol === 'bean') {
            height = 2.2;
        } else if (symbol === 'bench') {
            height = 1.5;
        } else if (symbol === 'daybed') {
            height = 2.2;
        } else if (symbol === 'bed') {
            height = 2.5;
        } else if (symbol === 'bunk') {
            height = 5.5;
        } else if (symbol === 'crib') {
            height = 3;
        } else if (symbol === 'table' || symbol === 'table-round' || symbol === 'desk' || symbol === 'ldesk' || symbol === 'nest') {
            height = 2.5;
        } else if (symbol === 'shelves') {
            height = 6;
        } else if (symbol === 'doors' || symbol === 'drawers') {
            height = /wardrobe|armoire|pantry|linen|closet/.test(name) ? 7 : 2.8;
        } else if (symbol === 'tv') {
            height = 2;
        } else if (symbol === 'toilet') {
            height = 2.5;
        } else if (symbol === 'bath') {
            height = 2;
        } else if (symbol === 'shower') {
            height = 7;
        } else if (symbol === 'sink' || symbol === 'sink2' || symbol === 'pedestal') {
            height = 2.8;
        } else if (symbol === 'fridge') {
            height = /chest freezer/.test(name) ? 3 : 6.2;
        } else if (symbol === 'range' || symbol === 'oven' || symbol === 'dishwasher') {
            height = 3;
        } else if (symbol === 'island') {
            height = 3;
        } else if (symbol === 'changing') {
            height = 3;
        } else if (symbol === 'plant') {
            height = 4;
        } else if (symbol === 'lamp') {
            height = 5;
        } else if (symbol === 'fire') {
            height = 1.5;
        } else if (symbol === 'hottub') {
            height = 3;
        } else if (symbol === 'grill') {
            height = 4;
        } else if (symbol === 'fireplace') {
            height = 4.5;
        } else if (symbol === 'chest' || symbol === 'hamper') {
            height = 2.2;
        } else if (symbol === 'mirror') {
            height = 5;
        } else if (symbol === 'printer') {
            height = 1.2;
        } else if (symbol === 'highchair') {
            height = 3.5;
        } else if (symbol === 'planter') {
            height = 1.5;
        } else if (symbol === 'hammock') {
            height = 4;
        } else if (symbol === 'coat') {
            height = 6;
        } else if (symbol === 'dogbed') {
            height = 0.6;
        } else if (symbol === 'crate') {
            height = 2.5;
        } else if (symbol === 'cat') {
            height = 5.5;
        } else if (symbol === 'box') {
            height = 2;
        } else if (symbol === 'stove') {
            height = 2.5;
        } else if (symbol === 'radiator') {
            height = 2;
        } else if (symbol === 'divider') {
            height = 6;
        } else if (symbol === 'washer' || symbol === 'dryer') {
            height = 3.5;
        } else if (symbol === 'iron') {
            height = 3;
        } else if (symbol === 'treadmill') {
            height = 5;
        } else if (symbol === 'bike') {
            height = 3.5;
        } else if (symbol === 'rower') {
            height = 2;
        } else if (symbol === 'weights') {
            height = 1.5;
        } else if (symbol === 'pool' || symbol === 'pingpong') {
            height = 2.5;
        } else if (symbol === 'foosball') {
            height = 3;
        } else if (symbol === 'piano') {
            height = 4;
        } else if (symbol === 'grand') {
            height = 3.3;
        } else if (symbol === 'keyboard') {
            height = 3;
        } else if (symbol === 'easel') {
            height = 5;
        } else if (symbol === 'aquarium') {
            height = 2;
        } else if (symbol === 'picnic') {
            height = 2.5;
        } else if (symbol === 'car') {
            height = 5;
        } else if (symbol === 'swing') {
            height = 7;
        }
        return { height: height, base: base };
    }

    function designateHeights() {
        allPieces().forEach(function (entry) {
            var profile = pieceProfile(entry);
            if (!isFinite(Number(entry.height)) || Number(entry.height) <= 0) {
                entry.height = profile.height;
            }
            if (!isFinite(Number(entry.base))) {
                entry.base = profile.base;
            }
        });
    }

    function placedHeight(item) {
        var entry = item && catalogItem(item.catalogId);
        var height = entry && isFinite(Number(entry.height)) ? Number(entry.height) : 3;
        if (item && isFinite(Number(item.height))) {
            height = Number(item.height);
        }
        return Math.round(Math.min(12, Math.max(0.05, height)) * 10) / 10;
    }

    function artSofa(w, d, color, stroke, sw, seats) {
        var back = Math.min(0.62, Math.max(0.28, d * 0.24));
        var arm = Math.min(0.46, Math.max(0.22, w * 0.12));
        var rail = Math.min(0.14, d * 0.08);
        var gap = 0.08;
        var count = seats || (w >= 6.5 ? 3 : 2);
        var seatW = (w - arm * 2 - gap * (count + 1)) / count;
        var seatY = back + 0.06;
        var seatH = d - seatY - rail - 0.12;
        var markup = furnBody(w, d, color, stroke, sw, false);
        var index;
        var inner = '';
        inner += furnRect(0.08, d - rail - 0.05, w - 0.16, rail, MAT.woodDark, 0.03);
        inner += furnRect(0.05, 0.05, arm, d - rail - 0.12, tint(color, -0.18), 0.1);
        inner += furnRect(w - arm - 0.05, 0.05, arm, d - rail - 0.12, tint(color, -0.18), 0.1);
        inner += furnRect(arm * 0.55, 0.05, w - arm * 1.1, back, tint(color, -0.28), 0.08);
        for (index = 0; index < count; index += 1) {
            inner += furnRect(arm + gap + index * (seatW + gap), seatY, seatW, Math.max(seatH, 0.2), MAT.linen, 0.08, 'rgba(63,41,24,0.35)', 0.028);
        }
        markup += partGroup(inner);
        return markup;
    }

    function artChair(w, d, color, stroke, sw) {
        return artSofa(w, d, color, stroke, sw, 1);
    }

    function artLounge(w, d, color, stroke, sw) {
        var back = Math.min(0.7, d * 0.2);
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        markup += partGroup(
            furnRect(0.1, 0.1, w - 0.2, d - 0.2, color, 0.08) +
            furnRect(0.16, 0.14, w - 0.32, back, tint(color, -0.22), 0.08) +
            furnRect(0.2, back + 0.16, w - 0.4, d - back - 0.4, MAT.linen, 0.08, 'rgba(63,41,24,0.28)', 0.025)
        );
        return markup;
    }

    function runMeasures(w, d) {
        return {
            seat: Math.min(2.6, Math.max(1.4, d * 0.46)),
            arm: Math.min(2.4, Math.max(1.6, w * 0.34))
        };
    }

    function artRun(w, d, color, stroke, sw, side) {
        var measures = runMeasures(w, d);
        var seat = measures.seat;
        var arm = measures.arm;
        var back = Math.min(0.5, seat * 0.28);
        var hookX = side === 'right' ? w - arm : 0;
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(seat) + '" fill="transparent"></rect>' +
            '<rect x="' + num(hookX) + '" y="0" width="' + num(arm) + '" height="' + num(d) + '" fill="transparent"></rect>';
        var inner = '';
        if (side === 'right') {
            inner += furnRect(0, 0, w, seat, color, 0.1);
            inner += furnRect(w - arm, 0, arm, d, color, 0.1);
            inner += furnRect(0.12, 0.08, w - arm - 0.08, back, tint(color, -0.26), 0.06);
            inner += furnRect(w - arm + 0.1, 0.08, arm - 0.22, back, tint(color, -0.26), 0.06);
            inner += furnRect(0.16, back + 0.1, w - arm - 0.16, seat - back - 0.22, MAT.linen, 0.08, 'rgba(63,41,24,0.3)', 0.025);
            inner += furnRect(w - arm + 0.14, back + 0.12, arm - 0.28, d - back - 0.28, MAT.linen, 0.08, 'rgba(63,41,24,0.3)', 0.025);
        } else {
            inner += furnRect(0, 0, w, seat, color, 0.1);
            inner += furnRect(0, 0, arm, d, color, 0.1);
            inner += furnRect(arm + 0.04, 0.08, w - arm - 0.16, back, tint(color, -0.26), 0.06);
            inner += furnRect(0.1, 0.08, arm - 0.2, back, tint(color, -0.26), 0.06);
            inner += furnRect(arm + 0.08, back + 0.1, w - arm - 0.24, seat - back - 0.22, MAT.linen, 0.08, 'rgba(63,41,24,0.3)', 0.025);
            inner += furnRect(0.14, back + 0.12, arm - 0.28, d - back - 0.28, MAT.linen, 0.08, 'rgba(63,41,24,0.3)', 0.025);
        }
        markup += partGroup(inner);
        markup += '<rect x="0" y="0" width="' + num(w) + '" height="' + num(seat) + '" rx="0.1" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        markup += '<rect x="' + num(hookX) + '" y="0" width="' + num(arm) + '" height="' + num(d) + '" rx="0.1" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artCurve(w, d, color, stroke, sw) {
        var path = 'M ' + num(0.06) + ' ' + num(d * 0.58) +
            ' Q ' + num(w / 2) + ' ' + num(0.04) + ' ' + num(w - 0.06) + ' ' + num(d * 0.58) +
            ' L ' + num(w - 0.34) + ' ' + num(d * 0.9) +
            ' Q ' + num(w / 2) + ' ' + num(d * 0.3) + ' ' + num(0.34) + ' ' + num(d * 0.9) + ' Z';
        return '<path d="' + path + '" fill="' + color + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></path>' +
            partGroup(
                furnOval(w * 0.28, d * 0.52, Math.max(w * 0.08, 0.2), Math.max(d * 0.1, 0.16), MAT.linen) +
                furnOval(w * 0.5, d * 0.4, Math.max(w * 0.1, 0.24), Math.max(d * 0.1, 0.16), MAT.linen) +
                furnOval(w * 0.72, d * 0.52, Math.max(w * 0.08, 0.2), Math.max(d * 0.1, 0.16), MAT.linen)
            );
    }

    function artCar(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += partGroup(
            furnRect(0.04, d * 0.08, w * 0.18, d * 0.16, MAT.ink, 0.04) +
            furnRect(w - w * 0.22, d * 0.08, w * 0.18, d * 0.16, MAT.ink, 0.04) +
            furnRect(0.04, d * 0.74, w * 0.18, d * 0.16, MAT.ink, 0.04) +
            furnRect(w - w * 0.22, d * 0.74, w * 0.18, d * 0.16, MAT.ink, 0.04) +
            furnRect(w * 0.22, d * 0.28, w * 0.56, d * 0.36, '#d5e2ea', 0.06) +
            furnRect(w * 0.3, d * 0.08, w * 0.4, d * 0.12, tint(color, 0.2), 0.04)
        );
        return markup;
    }

    function artSwing(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += partGroup(
            '<line x1="' + num(w * 0.12) + '" y1="' + num(d * 0.9) + '" x2="' + num(w * 0.28) + '" y2="' + num(d * 0.12) + '" stroke="' + color + '" stroke-width="0.12"></line>' +
            '<line x1="' + num(w * 0.44) + '" y1="' + num(d * 0.9) + '" x2="' + num(w * 0.28) + '" y2="' + num(d * 0.12) + '" stroke="' + color + '" stroke-width="0.12"></line>' +
            '<line x1="' + num(w * 0.56) + '" y1="' + num(d * 0.9) + '" x2="' + num(w * 0.72) + '" y2="' + num(d * 0.12) + '" stroke="' + color + '" stroke-width="0.12"></line>' +
            '<line x1="' + num(w * 0.88) + '" y1="' + num(d * 0.9) + '" x2="' + num(w * 0.72) + '" y2="' + num(d * 0.12) + '" stroke="' + color + '" stroke-width="0.12"></line>' +
            '<line x1="' + num(w * 0.08) + '" y1="' + num(d * 0.16) + '" x2="' + num(w * 0.92) + '" y2="' + num(d * 0.16) + '" stroke="' + color + '" stroke-width="0.1"></line>' +
            furnRect(w * 0.22, d * 0.34, w * 0.16, d * 0.08, MAT.linen, 0.04) +
            furnRect(w * 0.62, d * 0.34, w * 0.16, d * 0.08, MAT.linen, 0.04)
        );
        markup += '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artTable(w, d, color, stroke, sw, round) {
        var markup;
        if (round) {
            markup = hitRect(w, d);
            markup += partGroup(
                furnOval(w / 2, d / 2, w / 2 - 0.02, d / 2 - 0.02, MAT.woodDark) +
                furnOval(w / 2, d / 2, Math.max(w / 2 - 0.16, 0.08), Math.max(d / 2 - 0.16, 0.08), color) +
                furnOval(w / 2, d / 2, Math.min(w, d) * 0.07, Math.min(w, d) * 0.07, MAT.woodDark)
            );
            markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w / 2 - 0.02) + '" ry="' + num(d / 2 - 0.02) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
            return markup;
        }
        return partWoodTop(w, d, color, stroke, sw);
    }

    function artShelves(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        var count = Math.max(3, Math.round(w / 0.55));
        var gap = 0.06;
        var bookW = (w - 0.16 - gap * (count + 1)) / count;
        var index;
        var inner = furnRect(0.08, 0.08, w - 0.16, 0.07, color, 0.02);
        for (index = 0; index < count; index += 1) {
            inner += furnRect(0.08 + gap + index * (bookW + gap), 0.22, bookW, Math.max(0.16, d - 0.36), BOOK_TONES[index % BOOK_TONES.length], 0.02);
        }
        markup += partGroup(inner);
        return markup;
    }

    function artTv(w, d, color, stroke, sw) {
        var screen = Math.min(0.22, Math.max(0.1, d * 0.2));
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += partGroup(
            furnRect(0.1, 0.07, w - 0.2, screen, MAT.glass, 0.02) +
            furnRect(w * 0.42, 0.07 + screen * 0.35, w * 0.16, Math.max(screen * 0.3, 0.05), MAT.glassLite, 0.01) +
            partPull(w, d)
        );
        return markup;
    }

    function artDrawers(w, d, color, stroke, sw) {
        var rows = d >= 1.7 ? 3 : 2;
        var gap = 0.05;
        var rowH = (d - 0.14 - gap * (rows + 1)) / rows;
        var knobs = w >= 4 ? 2 : 1;
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        var inner = '';
        var row;
        var knob;
        for (row = 0; row < rows; row += 1) {
            var y = gap + row * (rowH + gap);
            inner += furnRect(0.08, y, w - 0.16, rowH, color, 0.03);
            for (knob = 0; knob < knobs; knob += 1) {
                inner += partKnob((w / (knobs + 1)) * (knob + 1), y + rowH * 0.72);
            }
        }
        markup += partGroup(inner);
        return markup;
    }

    function artDoors(w, d, color, stroke, sw) {
        var doors = w >= 4.5 ? 3 : (w >= 2.2 ? 2 : 1);
        var gap = 0.06;
        var panelW = (w - gap * (doors + 1)) / doors;
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        var inner = '';
        var index;
        for (index = 0; index < doors; index += 1) {
            var x = gap + index * (panelW + gap);
            inner += furnRect(x, 0.08, panelW, Math.max(d - 0.28, 0.2), color, 0.03);
            inner += partKnob(x + panelW * 0.72, Math.max(d - 0.4, 0.3));
        }
        inner += furnRect(0.06, d - 0.14, w - 0.12, 0.08, MAT.wood, 0.02);
        markup += partGroup(inner);
        return markup;
    }

    function artBed(w, d, color, stroke, sw) {
        var head = Math.min(0.72, Math.max(0.36, d * 0.14));
        var pillowD = Math.min(0.9, d * 0.18);
        var pillowW = Math.max((w - 0.46) / 2, 0.3);
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        markup += partGroup(
            furnRect(0.1, head * 0.82, w - 0.2, d - head - 0.24, MAT.linen, 0.04) +
            furnRect(0, 0, w, head, color, 0.05) +
            furnRect(0.16, head + 0.08, pillowW, pillowD, '#fffdf8', 0.1, 'rgba(44,42,38,0.22)', 0.025) +
            furnRect(w / 2 + 0.07, head + 0.08, pillowW, pillowD, '#f3eee6', 0.1, 'rgba(44,42,38,0.22)', 0.025) +
            furnRect(0.08, d - 0.16, w - 0.16, 0.1, MAT.wood, 0.03)
        );
        return markup;
    }

    function artBench(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        markup += partGroup(
            furnRect(0.1, 0.12, w - 0.2, d - 0.24, color, 0.06) +
            furnRect(0.16, 0.2, w - 0.32, d - 0.4, MAT.linen, 0.06, 'rgba(63,41,24,0.28)', 0.025)
        );
        return markup;
    }

    function artSideChair(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += partGroup(
            furnRect(w * 0.18, 0.05, w * 0.64, d * 0.16, MAT.woodDark, 0.04) +
            furnRect(w * 0.14, d * 0.26, w * 0.72, d * 0.48, color, 0.08) +
            furnRect(w * 0.2, d * 0.34, w * 0.6, d * 0.32, MAT.linen, 0.06, 'rgba(63,41,24,0.28)', 0.025) +
            furnRect(0.05, 0.08, 0.12, 0.12, MAT.woodDark, 0.02) +
            furnRect(w - 0.17, 0.08, 0.12, 0.12, MAT.woodDark, 0.02) +
            furnRect(0.05, d - 0.2, 0.12, 0.12, MAT.woodDark, 0.02) +
            furnRect(w - 0.17, d - 0.2, 0.12, 0.12, MAT.woodDark, 0.02)
        );
        markup += '<rect x="' + num(w * 0.12) + '" y="' + num(d * 0.22) + '" width="' + num(w * 0.76) + '" height="' + num(d * 0.58) + '" rx="0.08" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artStool(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += partGroup(
            furnOval(w / 2, d / 2, w * 0.4, d * 0.4, MAT.metalDark) +
            furnOval(w / 2, d / 2, w * 0.3, d * 0.3, color) +
            furnOval(w / 2, d / 2, w * 0.1, d * 0.1, MAT.woodDark)
        );
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.4) + '" ry="' + num(d * 0.4) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artOfficeChair(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += partGroup(
            furnOval(w / 2, d * 0.78, w * 0.34, d * 0.1, MAT.metalDark) +
            furnRect(w * 0.2, 0.06, w * 0.6, d * 0.18, tint(color, -0.2), 0.08) +
            furnOval(w / 2, d * 0.5, w * 0.28, d * 0.2, color) +
            furnOval(w / 2, d * 0.5, w * 0.08, d * 0.07, MAT.metal)
        );
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.5) + '" rx="' + num(w * 0.3) + '" ry="' + num(d * 0.22) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artDesk(w, d, color, stroke, sw) {
        var screenH = Math.min(0.16, d * 0.14);
        var markup = artTable(w, d, color, stroke, sw, false);
        markup += partGroup(
            furnRect(w * 0.28, 0.16, w * 0.44, screenH, MAT.glass, 0.02) +
            furnRect(w * 0.46, 0.16 + screenH, w * 0.08, 0.06, MAT.metalDark, 0.01)
        );
        return markup;
    }

    function artLDesk(w, d, color, stroke, sw) {
        var arm = Math.min(w * 0.42, 2.4);
        var depth = Math.min(d * 0.42, 2.2);
        var markup = hitRect(w, d);
        markup += partGroup(
            furnRect(0, 0, w, depth, MAT.woodDark, 0.06) +
            furnRect(0, 0, arm, d, MAT.woodDark, 0.06) +
            furnRect(0.1, 0.1, w - 0.2, depth - 0.2, color, 0.04) +
            furnRect(0.1, 0.1, arm - 0.2, d - 0.2, color, 0.04) +
            furnRect(arm + 0.22, 0.16, Math.max(0.2, w - arm - 0.5), 0.12, MAT.glass, 0.02)
        );
        markup += '<rect x="0" y="0" width="' + num(w) + '" height="' + num(depth) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        markup += '<rect x="0" y="0" width="' + num(arm) + '" height="' + num(d) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artToilet(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += partGroup(
            furnRect(w * 0.14, 0.04, w * 0.72, d * 0.3, MAT.porcelain, 0.06, 'rgba(90,110,120,0.45)', 0.03) +
            furnOval(w / 2, d * 0.66, w * 0.34, d * 0.26, MAT.porcelain) +
            furnOval(w / 2, d * 0.66, w * 0.2, d * 0.14, MAT.water) +
            partKnob(w / 2, d * 0.16)
        );
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.66) + '" rx="' + num(w * 0.36) + '" ry="' + num(d * 0.28) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        markup += '<rect x="' + num(w * 0.14) + '" y="0.04" width="' + num(w * 0.72) + '" height="' + num(d * 0.3) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artBath(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, MAT.porcelain, stroke, sw, false);
        markup += partGroup(
            furnRect(0.14, 0.18, w - 0.28, d - 0.34, MAT.water, 0.18) +
            furnOval(w * 0.22, 0.32, 0.08, 0.08, MAT.metal) +
            furnOval(w * 0.78, d - 0.28, 0.07, 0.07, MAT.metalDark)
        );
        return markup;
    }

    function artShower(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, MAT.porcelain, stroke, sw, false);
        markup += partGroup(
            furnRect(0.1, 0.1, w - 0.2, d - 0.2, MAT.glassLite, 0.04, 'rgba(90,110,120,0.55)', 0.04) +
            furnOval(w * 0.28, d * 0.28, 0.08, 0.08, MAT.metal) +
            furnOval(w / 2, d / 2, 0.1, 0.1, MAT.metalDark) +
            furnRect(w - 0.16, 0.18, 0.05, d - 0.36, MAT.metal, 0)
        );
        return markup;
    }

    function artSink(w, d, color, stroke, sw, count) {
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        var sinks = count || 1;
        var index;
        var inner = furnRect(0.08, 0.08, w - 0.16, d - 0.16, MAT.stone, 0.04);
        inner += furnRect(0.08, 0.08, w - 0.16, 0.1, color, 0.02);
        for (index = 0; index < sinks; index += 1) {
            var cx = (w / sinks) * (index + 0.5);
            inner += furnOval(cx, d * 0.58, Math.min(0.36, w / sinks * 0.26), Math.min(0.26, d * 0.2), MAT.porcelain);
            inner += furnOval(cx, d * 0.58, Math.min(0.22, w / sinks * 0.16), Math.min(0.14, d * 0.12), MAT.water);
            inner += partKnob(cx, d * 0.34);
        }
        markup += partGroup(inner);
        return markup;
    }

    function artFridge(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += partGroup(
            furnRect(0.1, d * 0.62, w - 0.2, 0.045, MAT.metalDark, 0) +
            partPull(w, d)
        );
        return markup;
    }

    function artRange(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, MAT.metalDark, stroke, sw, false);
        markup += partGroup(
            furnRect(0.1, 0.1, w - 0.2, d - 0.36, MAT.glass, 0.04) +
            furnOval(w * 0.32, d * 0.32, w * 0.14, d * 0.12, MAT.metal) +
            furnOval(w * 0.68, d * 0.32, w * 0.14, d * 0.12, MAT.metal) +
            furnOval(w * 0.32, d * 0.32, w * 0.07, d * 0.06, MAT.ink) +
            furnOval(w * 0.68, d * 0.32, w * 0.07, d * 0.06, MAT.ink) +
            furnOval(w * 0.32, d * 0.58, w * 0.12, d * 0.1, MAT.metal) +
            furnOval(w * 0.68, d * 0.58, w * 0.12, d * 0.1, MAT.metal) +
            furnOval(w * 0.32, d * 0.58, w * 0.06, d * 0.05, MAT.ink) +
            furnOval(w * 0.68, d * 0.58, w * 0.06, d * 0.05, MAT.ink) +
            partKnob(w * 0.3, d - 0.16) +
            partKnob(w * 0.5, d - 0.16) +
            partKnob(w * 0.7, d - 0.16)
        );
        return markup;
    }

    function artDishwasher(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += partGroup(partDeck(w, d) + partPull(w, d));
        return markup;
    }

    function artIsland(w, d, color, stroke, sw) {
        var markup = artTable(w, d, color, stroke, sw, false);
        markup += partGroup(
            furnOval(w * 0.72, d / 2, Math.min(0.42, w * 0.1), Math.min(0.28, d * 0.2), MAT.porcelain) +
            furnOval(w * 0.72, d / 2, Math.min(0.24, w * 0.06), Math.min(0.16, d * 0.12), MAT.water) +
            partKnob(w * 0.72, d * 0.32)
        );
        return markup;
    }

    function artCrib(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, 0.12), stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.16, 0.2, w - 0.32, d - 0.4, '#f6f1e8', 0.06);
        markup += furnRect(0.05, 0.12, 0.1, d - 0.24, MAT.woodDark, 0.03);
        markup += furnRect(w - 0.15, 0.12, 0.1, d - 0.24, MAT.woodDark, 0.03);
        markup += '</g>';
        return markup;
    }

    function artChanging(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        markup += partGroup(
            furnRect(0.08, 0.08, w - 0.16, d - 0.16, color, 0.04) +
            furnRect(0.14, 0.16, w - 0.28, d - 0.36, MAT.linen, 0.08, 'rgba(63,41,24,0.25)', 0.025) +
            furnOval(w * 0.28, 0.34, 0.09, 0.09, MAT.porcelain) +
            partKnob(w * 0.46, 0.34)
        );
        return markup;
    }

    function artRug(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" rx="0.06" fill="' + color + '" fill-opacity="0.94" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        markup += partGroup(
            '<rect pointer-events="none" x="0.16" y="0.16" width="' + num(w - 0.32) + '" height="' + num(d - 0.32) + '" rx="0.04" fill="none" stroke="' + MAT.linen + '" stroke-width="0.06"></rect>' +
            '<rect pointer-events="none" x="0.32" y="0.32" width="' + num(Math.max(w - 0.64, 0.1)) + '" height="' + num(Math.max(d - 0.64, 0.1)) + '" rx="0.04" fill="none" stroke="' + tint(color, -0.35) + '" stroke-width="0.035"></rect>'
        );
        return markup;
    }

    function artPlant(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.36, d * 0.36, color);
        markup += furnOval(w * 0.36, d * 0.42, w * 0.16, d * 0.16, tint(color, 0.16));
        markup += furnOval(w * 0.64, d * 0.46, w * 0.14, d * 0.14, tint(color, -0.12));
        markup += furnOval(w / 2, d / 2, w * 0.1, d * 0.1, '#8a6a4f');
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.38) + '" ry="' + num(d * 0.38) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artLamp(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.34, d * 0.34, tint(color, 0.2));
        markup += furnOval(w / 2, d / 2, w * 0.12, d * 0.12, tint(color, -0.25));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.36) + '" ry="' + num(d * 0.36) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artFire(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, -0.15), stroke, sw, true);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.28, d * 0.28, '#5c3a2e');
        markup += furnOval(w / 2, d / 2, w * 0.14, d * 0.14, '#d4652f');
        markup += '</g>';
        return markup;
    }

    function artHotTub(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, -0.12), stroke, sw, true);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.38, d * 0.38, tint(color, 0.18));
        markup += furnOval(w * 0.38, d * 0.42, w * 0.06, d * 0.06, 'rgba(255,255,255,0.7)');
        markup += furnOval(w * 0.58, d * 0.55, w * 0.05, d * 0.05, 'rgba(255,255,255,0.55)');
        markup += '</g>';
        return markup;
    }

    function artGrill(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.12, w - 0.24, d - 0.4, MAT.metalDark, 0.06);
        markup += furnRect(0.2, 0.2, w - 0.4, d - 0.56, MAT.ink, 0.04);
        markup += furnRect(0.28, d * 0.34, w - 0.56, 0.045, MAT.metal, 0);
        markup += furnRect(0.28, d * 0.5, w - 0.56, 0.045, MAT.metal, 0);
        markup += partPull(w, d);
        markup += '</g>';
        return markup;
    }

    function artFireplace(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.16, d * 0.22, w * 0.68, d * 0.5, '#2a2420', 0.04);
        markup += furnOval(w / 2, d * 0.48, Math.min(0.35, w * 0.1), Math.min(0.28, d * 0.16), '#d4652f');
        markup += '</g>';
        return markup;
    }

    function hitRect(w, d) {
        return '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
    }

    function artKeys(x, y, width, height, count) {
        var markup = '';
        var keyW = width / count;
        var index;
        var pos;
        for (index = 0; index < count; index += 1) {
            markup += furnRect(x + index * keyW + 0.01, y, Math.max(keyW - 0.02, 0.04), height, MAT.linen, 0.01, 'rgba(44,42,38,0.25)', 0.015);
        }
        for (index = 0; index < count - 1; index += 1) {
            pos = index % 7;
            if (pos === 2 || pos === 6) {
                continue;
            }
            markup += furnRect(x + (index + 0.62) * keyW, y, Math.max(keyW * 0.5, 0.04), height * 0.58, MAT.ink, 0.01);
        }
        return markup;
    }

    function artOttoman(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += partGroup(
            furnRect(0.12, 0.12, w - 0.24, d - 0.24, MAT.linen, 0.1, 'rgba(63,41,24,0.3)', 0.028) +
            furnRect(0.08, d - 0.16, 0.14, 0.1, MAT.woodDark, 0.02) +
            furnRect(w - 0.22, d - 0.16, 0.14, 0.1, MAT.woodDark, 0.02)
        );
        return markup;
    }

    function artPouf(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.4, d * 0.4, color);
        markup += furnOval(w / 2, d / 2, w * 0.22, d * 0.22, tint(color, 0.18));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.4) + '" ry="' + num(d * 0.4) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artBean(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w * 0.42, d * 0.48, w * 0.32, d * 0.34, color);
        markup += furnOval(w * 0.62, d * 0.42, w * 0.26, d * 0.28, tint(color, 0.12));
        markup += furnOval(w * 0.5, d * 0.62, w * 0.22, d * 0.2, tint(color, -0.1));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.4) + '" ry="' + num(d * 0.4) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artRecliner(w, d, color, stroke, sw) {
        var back = Math.min(0.7, d * 0.24);
        var foot = Math.min(1.15, d * 0.32);
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, 0.08, w - 0.2, back, tint(color, -0.26), 0.08);
        markup += furnRect(0.16, back + 0.08, w - 0.32, Math.max(d - back - foot - 0.1, 0.2), MAT.linen, 0.08, 'rgba(63,41,24,0.3)', 0.025);
        markup += furnRect(0.28, d - foot, w - 0.56, Math.max(foot - 0.1, 0.16), MAT.linen, 0.08, 'rgba(63,41,24,0.3)', 0.025);
        markup += '</g>';
        return markup;
    }

    function artRocker(w, d, color, stroke, sw) {
        var markup = artChair(w, d, color, stroke, sw);
        markup += '<g pointer-events="none">';
        markup += furnOval(0.12, d * 0.62, 0.1, Math.min(d * 0.28, 0.7), MAT.woodDark);
        markup += furnOval(w - 0.12, d * 0.62, 0.1, Math.min(d * 0.28, 0.7), MAT.woodDark);
        markup += '</g>';
        return markup;
    }

    function artNest(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.02, 0.02, w * 0.7, d * 0.78, MAT.woodDark, 0.04);
        markup += furnRect(0.08, 0.08, w * 0.7 - 0.12, d * 0.78 - 0.12, color, 0.03);
        markup += furnRect(w * 0.32, d * 0.28, w * 0.64, d * 0.66, MAT.woodDark, 0.04);
        markup += furnRect(w * 0.36, d * 0.34, w * 0.64 - 0.08, d * 0.66 - 0.12, color, 0.03);
        markup += '</g>';
        markup += '<rect x="0.02" y="0.02" width="' + num(w * 0.7) + '" height="' + num(d * 0.78) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        markup += '<rect x="' + num(w * 0.32) + '" y="' + num(d * 0.28) + '" width="' + num(w * 0.64) + '" height="' + num(d * 0.66) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artBunk(w, d, color, stroke, sw) {
        var rail = Math.min(0.42, w * 0.18);
        var inner = Math.max(w - rail, 0.8);
        var markup = hitRect(w, d);
        var rungs = 4;
        var index;
        markup += artBed(inner, d, color, stroke, sw);
        markup += '<g pointer-events="none">';
        markup += furnRect(inner + 0.04, 0.12, Math.max(rail - 0.08, 0.12), d - 0.24, MAT.woodDark, 0.03);
        for (index = 0; index < rungs; index += 1) {
            markup += furnRect(inner + 0.06, 0.4 + index * ((d - 0.9) / rungs), Math.max(rail - 0.12, 0.1), 0.08, MAT.wood, 0.02);
        }
        markup += '</g>';
        return markup;
    }

    function artDaybed(w, d, color, stroke, sw) {
        var back = Math.min(0.42, w * 0.18);
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        markup += partGroup(
            furnRect(back + 0.06, 0.1, w - back - 0.16, d - 0.28, MAT.linen, 0.05) +
            furnRect(0, 0, back, d, color, 0.05) +
            furnRect(back + 0.12, 0.16, w - back - 0.28, Math.min(0.9, d * 0.18), '#fffdf8', 0.08, 'rgba(44,42,38,0.2)', 0.025) +
            furnRect(back + 0.1, d - 0.16, w - back - 0.22, 0.08, MAT.wood, 0.02)
        );
        return markup;
    }

    function artChest(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, MAT.woodDark, stroke, sw, false);
        markup += partGroup(
            furnRect(0.08, 0.08, w - 0.16, d - 0.16, color, 0.04) +
            furnRect(0.12, d * 0.48, w - 0.24, 0.045, MAT.woodDark, 0) +
            partKnob(w / 2, d - 0.22)
        );
        return markup;
    }

    function artHamper(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.4, d * 0.4, color);
        markup += furnRect(w * 0.22, d * 0.46, w * 0.56, 0.06, tint(color, -0.2), 0);
        markup += furnRect(w * 0.46, d * 0.22, 0.06, d * 0.56, tint(color, -0.2), 0);
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.4) + '" ry="' + num(d * 0.4) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artMirror(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.12, 0.12, w - 0.24, d - 0.24, '#e7eef3', 0.02);
        return markup;
    }

    function artBoard(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, 0.1, w - 0.2, d - 0.32, '#f7f8fa', 0.02);
        markup += furnRect(0.16, d - 0.16, w - 0.32, 0.08, tint(color, -0.15), 0.02);
        markup += '</g>';
        return markup;
    }

    function artPrinter(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.16, 0.16, w - 0.32, d * 0.42, tint(color, -0.08), 0.04);
        markup += furnRect(0.2, d - 0.28, w - 0.4, 0.14, '#f7f1e7', 0.02);
        markup += '</g>';
        return markup;
    }

    function artPedestal(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.32, 0.06, w * 0.36, d * 0.42, tint(color, -0.08), 0.04);
        markup += furnOval(w / 2, d * 0.62, w * 0.38, d * 0.28, color);
        markup += furnOval(w / 2, d * 0.62, w * 0.2, d * 0.14, tint(color, 0.2));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.62) + '" rx="' + num(w * 0.38) + '" ry="' + num(d * 0.28) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artMicrowave(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.14, 0.16, w * 0.62, d - 0.32, '#2a3138', 0.04);
        markup += furnRect(w - 0.22, d * 0.35, 0.08, d * 0.35, tint(color, -0.25), 0.02);
        markup += '</g>';
        return markup;
    }

    function artOven(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.18, 0.18, w - 0.36, d - 0.48, '#1c242b', 0.04);
        markup += furnRect(0.28, 0.28, w - 0.56, d - 0.7, '#9bb0c2', 0.02);
        markup += furnRect(0.2, d - 0.2, w - 0.4, 0.08, tint(color, -0.2), 0.02);
        markup += '</g>';
        return markup;
    }

    function artHighchair(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.22, 0.06, w * 0.56, d * 0.16, tint(color, -0.16), 0.04);
        markup += furnRect(w * 0.18, d * 0.28, w * 0.64, d * 0.28, color, 0.06);
        markup += furnRect(0.06, d * 0.58, w - 0.12, d * 0.32, tint(color, 0.16), 0.06);
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.16) + '" y="' + num(d * 0.24) + '" width="' + num(w * 0.68) + '" height="' + num(d * 0.36) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artPlanter(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, d * 0.35, w - 0.2, d * 0.55, '#5c4030', 0.04);
        markup += furnOval(w * 0.3, d * 0.4, w * 0.16, d * 0.28, '#6b7f6a');
        markup += furnOval(w * 0.55, d * 0.32, w * 0.18, d * 0.26, '#8d9a84');
        markup += furnOval(w * 0.75, d * 0.42, w * 0.14, d * 0.24, '#5f6f5e');
        markup += '</g>';
        return markup;
    }

    function artHammock(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<polygon pointer-events="none" points="' + num(w * 0.22) + ',' + num(d * 0.18) + ' ' + num(w * 0.72) + ',' + num(d * 0.62) + ' ' + num(w * 0.84) + ',' + num(d * 0.74) + ' ' + num(w * 0.34) + ',' + num(d * 0.28) + '" fill="' + color + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></polygon>';
        markup += '<g pointer-events="none">';
        markup += furnOval(w * 0.16, d * 0.16, 0.12, 0.12, tint(color, -0.35));
        markup += furnOval(w * 0.84, d * 0.84, 0.12, 0.12, tint(color, -0.35));
        markup += '</g>';
        return markup;
    }

    function artRugRound(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.46, d * 0.46, color);
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.32) + '" ry="' + num(d * 0.32) + '" fill="none" stroke="' + tint(color, -0.28) + '" stroke-width="0.04"></ellipse>';
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.46) + '" ry="' + num(d * 0.46) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artCoat(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.16, d * 0.16, color);
        markup += furnOval(w / 2, d * 0.22, 0.1, 0.1, tint(color, -0.2));
        markup += furnOval(w * 0.22, d / 2, 0.1, 0.1, tint(color, -0.2));
        markup += furnOval(w * 0.78, d / 2, 0.1, 0.1, tint(color, -0.2));
        markup += furnOval(w / 2, d * 0.78, 0.1, 0.1, tint(color, -0.2));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.34) + '" ry="' + num(d * 0.34) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artDogbed(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.16, 0.16, w - 0.32, d - 0.32, tint(color, 0.22), 0.16);
        return markup;
    }

    function artCrate(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, 0.12), stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w / 2 - 0.03, 0.1, 0.06, d - 0.2, tint(color, -0.25), 0);
        markup += furnRect(0.1, d / 2 - 0.03, w - 0.2, 0.06, tint(color, -0.25), 0);
        markup += '</g>';
        return markup;
    }

    function artCat(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d * 0.32, w * 0.36, d * 0.22, color);
        markup += furnOval(w / 2, d * 0.72, w * 0.24, d * 0.16, tint(color, -0.12));
        markup += furnOval(w / 2, d / 2, 0.1, 0.1, '#6b5344');
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.32) + '" rx="' + num(w * 0.36) + '" ry="' + num(d * 0.22) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artBox(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.14, 0.14, w - 0.28, d - 0.28, tint(color, 0.16), 0.04);
        return markup;
    }

    function artStove(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w / 2 - 0.1, 0.06, 0.2, 0.16, tint(color, -0.2), 0.02);
        markup += furnOval(w / 2, d * 0.58, Math.min(w, d) * 0.28, Math.min(w, d) * 0.28, '#2a2420');
        markup += furnOval(w / 2, d * 0.58, Math.min(w, d) * 0.12, Math.min(w, d) * 0.12, '#d4652f');
        markup += '</g>';
        return markup;
    }

    function artRadiator(w, d, color, stroke, sw) {
        var fins = Math.max(6, Math.round(w / 0.28));
        var gap = (w - 0.16) / fins;
        var markup = furnBody(w, d, color, stroke, sw, false);
        var index;
        markup += '<g pointer-events="none">';
        for (index = 0; index < fins; index += 1) {
            markup += furnRect(0.08 + index * gap, 0.12, Math.max(gap - 0.06, 0.05), d - 0.24, tint(color, -0.12), 0.02);
        }
        markup += '</g>';
        return markup;
    }

    function artDivider(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(w / 2 - 0.03, 0.08, 0.06, d - 0.16, tint(color, -0.25), 0);
        return markup;
    }

    function artWasher(w, d, color, stroke, sw, windowed) {
        var radius = Math.min(w, d) * 0.26;
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += partGroup(
            partDeck(w, d) +
            furnOval(w / 2, d * 0.58, radius, radius, MAT.metal) +
            furnOval(w / 2, d * 0.58, radius * 0.78, radius * 0.78, windowed ? MAT.glassLite : tint(color, -0.04)) +
            furnOval(w / 2, d * 0.58, radius * 0.28, radius * 0.28, windowed ? '#f7fbfd' : MAT.metalDark)
        );
        return markup;
    }

    function artIron(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<polygon pointer-events="none" points="' + num(w / 2) + ',' + num(d - 0.12) + ' ' + num(w - 0.12) + ',' + num(0.5) + ' ' + num(w - 0.16) + ',0.1 ' + num(0.16) + ',0.1 ' + num(0.12) + ',' + num(0.5) + '" fill="' + color + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></polygon>';
        markup += furnRect(w * 0.28, 0.16, w * 0.44, 0.22, tint(color, -0.25), 0.06);
        return markup;
    }

    function artTreadmill(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.16, 0.08, w * 0.68, 0.28, '#2a3138', 0.04);
        markup += furnRect(w * 0.22, 0.48, w * 0.56, d - 0.7, tint(color, 0.12), 0.04);
        markup += furnRect(w * 0.22, d * 0.48, w * 0.56, 0.06, tint(color, -0.2), 0);
        markup += furnRect(w * 0.22, d * 0.66, w * 0.56, 0.06, tint(color, -0.2), 0);
        markup += '</g>';
        return markup;
    }

    function artBike(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.38, 0.2, w * 0.24, d - 0.45, tint(color, -0.15), 0.06);
        markup += furnOval(w / 2, d * 0.24, w * 0.32, d * 0.1, color);
        markup += furnOval(w / 2, d * 0.5, 0.12, 0.12, tint(color, 0.1));
        markup += furnOval(w / 2, d * 0.78, w * 0.3, d * 0.14, '#2a3138');
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.78) + '" rx="' + num(w * 0.3) + '" ry="' + num(d * 0.14) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artRower(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.38, 0.2, w * 0.24, d - 0.4, tint(color, -0.18), 0.04);
        markup += furnOval(w / 2, d * 0.32, w * 0.32, d * 0.06, color);
        markup += furnOval(w / 2, d * 0.84, w * 0.28, d * 0.08, '#2a3138');
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.36) + '" y="0.16" width="' + num(w * 0.28) + '" height="' + num(d - 0.32) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artWeights(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.28, 0.45, w * 0.44, d - 0.65, color, 0.08);
        markup += furnRect(0.08, 0.28, w - 0.16, 0.14, '#2a3138', 0.04);
        markup += furnOval(0.22, 0.35, 0.16, 0.16, tint(color, -0.2));
        markup += furnOval(w - 0.22, 0.35, 0.16, 0.16, tint(color, -0.2));
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.26) + '" y="0.42" width="' + num(w * 0.48) + '" height="' + num(d - 0.58) + '" rx="0.08" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artPool(w, d, color, stroke, sw) {
        var pockets = [
            [0.22, 0.22],
            [w / 2, 0.16],
            [w - 0.22, 0.22],
            [0.22, d - 0.22],
            [w / 2, d - 0.16],
            [w - 0.22, d - 0.22]
        ];
        var markup = furnBody(w, d, '#6b4f3a', stroke, sw, false);
        var index;
        markup += '<g pointer-events="none">';
        markup += furnRect(0.28, 0.28, w - 0.56, d - 0.56, color, 0.04);
        for (index = 0; index < pockets.length; index += 1) {
            markup += furnOval(pockets[index][0], pockets[index][1], 0.12, 0.12, '#1a1814');
        }
        markup += '</g>';
        return markup;
    }

    function artPing(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.12, w - 0.24, d - 0.24, tint(color, 0.12), 0.02);
        markup += furnRect(0.12, d / 2 - 0.05, w - 0.24, 0.1, '#f7f1e7', 0);
        markup += furnRect(w / 2 - 0.025, 0.2, 0.05, d - 0.4, 'rgba(255,255,255,0.7)', 0);
        markup += '</g>';
        return markup;
    }

    function artFoos(w, d, color, stroke, sw) {
        var rods = 6;
        var markup = furnBody(w, d, color, stroke, sw, false);
        var index;
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.16, w - 0.24, d - 0.32, '#2f6b45', 0.02);
        for (index = 0; index < rods; index += 1) {
            var y = 0.35 + index * ((d - 0.7) / rods);
            markup += furnRect(0.04, y, w - 0.08, 0.05, '#d6dde4', 0);
            markup += furnOval(w * 0.35, y + 0.025, 0.08, 0.08, index % 2 ? '#9a3412' : '#2a3138');
            markup += furnOval(w * 0.65, y + 0.025, 0.08, 0.08, index % 2 ? '#9a3412' : '#2a3138');
        }
        markup += '</g>';
        return markup;
    }

    function artPiano(w, d, color, stroke, sw) {
        var keyH = Math.min(0.42, d * 0.32);
        var count = Math.max(8, Math.round(w * 3));
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += artKeys(0.12, d - keyH - 0.08, w - 0.24, keyH, count);
        return markup;
    }

    function artGrand(w, d, color, stroke, sw) {
        var keyTop = Math.max(d * 0.62, d - 1.05);
        var count = Math.max(8, Math.round(w * 3));
        var markup = hitRect(w, d);
        markup += '<path pointer-events="none" d="M ' + num(w * 0.08) + ' ' + num(keyTop) + ' L ' + num(w * 0.92) + ' ' + num(keyTop) + ' L ' + num(w * 0.92) + ' ' + num(d * 0.42) + ' Q ' + num(w * 0.86) + ' ' + num(d * 0.08) + ' ' + num(w * 0.42) + ' ' + num(d * 0.08) + ' Q ' + num(w * 0.08) + ' ' + num(d * 0.14) + ' ' + num(w * 0.08) + ' ' + num(keyTop) + ' Z" fill="' + color + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></path>';
        markup += artKeys(w * 0.1, keyTop + 0.06, w * 0.8, Math.max(d - keyTop - 0.14, 0.4), count);
        return markup;
    }

    function artKeyboard(w, d, color, stroke, sw) {
        var count = Math.max(10, Math.round(w * 4));
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += artKeys(0.1, 0.16, w - 0.2, d - 0.32, count);
        return markup;
    }

    function artEasel(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.22, 0.12, w * 0.56, d * 0.62, '#f7f1e7', 0.04);
        markup += furnOval(w * 0.2, d * 0.84, 0.1, 0.1, color);
        markup += furnOval(w * 0.8, d * 0.84, 0.1, 0.1, color);
        markup += furnOval(w / 2, d * 0.16, 0.1, 0.1, color);
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.22) + '" y="0.12" width="' + num(w * 0.56) + '" height="' + num(d * 0.62) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artAquarium(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, 0.1, w - 0.2, d - 0.2, '#3d7f93', 0.04);
        markup += furnOval(w * 0.32, d * 0.48, Math.min(0.18, w * 0.08), Math.min(0.1, d * 0.16), '#d4652f');
        markup += furnOval(w * 0.62, d * 0.58, Math.min(0.14, w * 0.06), Math.min(0.08, d * 0.14), '#e6c8a0');
        markup += furnRect(0.18, d - 0.28, 0.22, Math.max(d * 0.16, 0.1), '#6b7f6a', 0.04);
        markup += '</g>';
        return markup;
    }

    function artPicnic(w, d, color, stroke, sw) {
        var bench = Math.min(0.62, w * 0.16);
        var tableX = bench + 0.2;
        var tableW = w - tableX * 2;
        var markup = hitRect(w, d);
        markup += partGroup(
            furnRect(0.04, 0.22, bench, d - 0.44, MAT.woodDark, 0.04) +
            furnRect(0.08, 0.3, Math.max(bench - 0.08, 0.12), d - 0.6, color, 0.04) +
            furnRect(w - bench - 0.04, 0.22, bench, d - 0.44, MAT.woodDark, 0.04) +
            furnRect(w - bench, 0.3, Math.max(bench - 0.08, 0.12), d - 0.6, color, 0.04) +
            furnRect(tableX, 0.1, tableW, d - 0.2, MAT.woodDark, 0.03) +
            furnRect(tableX + 0.08, 0.18, Math.max(tableW - 0.16, 0.2), d - 0.36, color, 0.03)
        );
        markup += '<rect x="' + num(tableX) + '" y="0.1" width="' + num(tableW) + '" height="' + num(d - 0.2) + '" rx="0.03" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artPlain(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.12, 0.12, w - 0.24, d - 0.24, tint(color, 0.12), 0.04);
        return markup;
    }

    function artCellar(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<line x1="0.2" y1="0.2" x2="' + num(w - 0.2) + '" y2="' + num(d - 0.2) + '" stroke="#3a2e26" stroke-width="0.07"></line>';
        markup += '<line x1="' + num(w - 0.2) + '" y1="0.2" x2="0.2" y2="' + num(d - 0.2) + '" stroke="#3a2e26" stroke-width="0.07"></line>';
        markup += '<rect x="' + num(w / 2 - 0.22) + '" y="' + num(d / 2 - 0.14) + '" width="0.44" height="0.28" rx="0.1" fill="#e7d3b8" stroke="#3a2e26" stroke-width="0.04"></rect>';
        return markup;
    }

    function pieceArt(entry, selected) {
        var symbol = symbolFor(entry);
        var stroke = selected ? '#0f766e' : 'rgba(22,51,47,0.38)';
        var sw = selected ? 0.07 : 0.03;
        var w = entry.width;
        var d = entry.depth;
        var color = entry.color;
        if ((symbol === 'sofa' || symbol === 'sectional' || symbol === 'chaise') && entry.form === 'straight') {
            return artSofa(w, d, color, stroke, sw);
        }
        if ((symbol === 'sofa' || symbol === 'sectional' || symbol === 'chaise') && entry.form === 'curve') {
            return artCurve(w, d, color, stroke, sw);
        }
        if ((symbol === 'sofa' || symbol === 'sectional' || symbol === 'chaise') && entry.form === 'cane') {
            return artRun(w, d, color, stroke, sw, 'right');
        }
        if (symbol === 'sofa') {
            return artSofa(w, d, color, stroke, sw);
        }
        if (symbol === 'chair') {
            return artChair(w, d, color, stroke, sw);
        }
        if (symbol === 'lounge') {
            return artLounge(w, d, color, stroke, sw);
        }
        if (symbol === 'chaise') {
            return artRun(w, d, color, stroke, sw, 'right');
        }
        if (symbol === 'sectional') {
            return artRun(w, d, color, stroke, sw, 'left');
        }
        if (symbol === 'table') {
            return artTable(w, d, color, stroke, sw, false);
        }
        if (symbol === 'table-round') {
            return artTable(w, d, color, stroke, sw, true);
        }
        if (symbol === 'shelves') {
            return artShelves(w, d, color, stroke, sw);
        }
        if (symbol === 'tv') {
            return artTv(w, d, color, stroke, sw);
        }
        if (symbol === 'drawers') {
            return artDrawers(w, d, color, stroke, sw);
        }
        if (symbol === 'doors') {
            return artDoors(w, d, color, stroke, sw);
        }
        if (symbol === 'bed') {
            return artBed(w, d, color, stroke, sw);
        }
        if (symbol === 'bench') {
            return artBench(w, d, color, stroke, sw);
        }
        if (symbol === 'side-chair') {
            return artSideChair(w, d, color, stroke, sw);
        }
        if (symbol === 'stool') {
            return artStool(w, d, color, stroke, sw);
        }
        if (symbol === 'office-chair') {
            return artOfficeChair(w, d, color, stroke, sw);
        }
        if (symbol === 'desk') {
            return artDesk(w, d, color, stroke, sw);
        }
        if (symbol === 'ldesk') {
            return artLDesk(w, d, color, stroke, sw);
        }
        if (symbol === 'toilet') {
            return artToilet(w, d, color, stroke, sw);
        }
        if (symbol === 'bath') {
            return artBath(w, d, color, stroke, sw);
        }
        if (symbol === 'shower') {
            return artShower(w, d, color, stroke, sw);
        }
        if (symbol === 'sink') {
            return artSink(w, d, color, stroke, sw, 1);
        }
        if (symbol === 'sink2') {
            return artSink(w, d, color, stroke, sw, 2);
        }
        if (symbol === 'fridge') {
            return artFridge(w, d, color, stroke, sw);
        }
        if (symbol === 'range') {
            return artRange(w, d, color, stroke, sw);
        }
        if (symbol === 'dishwasher') {
            return artDishwasher(w, d, color, stroke, sw);
        }
        if (symbol === 'island') {
            return artIsland(w, d, color, stroke, sw);
        }
        if (symbol === 'crib') {
            return artCrib(w, d, color, stroke, sw);
        }
        if (symbol === 'changing') {
            return artChanging(w, d, color, stroke, sw);
        }
        if (symbol === 'rug') {
            return artRug(w, d, color, stroke, sw);
        }
        if (symbol === 'plant') {
            return artPlant(w, d, color, stroke, sw);
        }
        if (symbol === 'lamp') {
            return artLamp(w, d, color, stroke, sw);
        }
        if (symbol === 'fire') {
            return artFire(w, d, color, stroke, sw);
        }
        if (symbol === 'hottub') {
            return artHotTub(w, d, color, stroke, sw);
        }
        if (symbol === 'grill') {
            return artGrill(w, d, color, stroke, sw);
        }
        if (symbol === 'fireplace') {
            return artFireplace(w, d, color, stroke, sw);
        }
        if (symbol === 'ottoman') {
            return artOttoman(w, d, color, stroke, sw);
        }
        if (symbol === 'pouf') {
            return artPouf(w, d, color, stroke, sw);
        }
        if (symbol === 'bean') {
            return artBean(w, d, color, stroke, sw);
        }
        if (symbol === 'recliner') {
            return artRecliner(w, d, color, stroke, sw);
        }
        if (symbol === 'rocker') {
            return artRocker(w, d, color, stroke, sw);
        }
        if (symbol === 'nest') {
            return artNest(w, d, color, stroke, sw);
        }
        if (symbol === 'bunk') {
            return artBunk(w, d, color, stroke, sw);
        }
        if (symbol === 'daybed') {
            return artDaybed(w, d, color, stroke, sw);
        }
        if (symbol === 'chest') {
            return artChest(w, d, color, stroke, sw);
        }
        if (symbol === 'hamper') {
            return artHamper(w, d, color, stroke, sw);
        }
        if (symbol === 'mirror') {
            return artMirror(w, d, color, stroke, sw);
        }
        if (symbol === 'board') {
            return artBoard(w, d, color, stroke, sw);
        }
        if (symbol === 'printer') {
            return artPrinter(w, d, color, stroke, sw);
        }
        if (symbol === 'pedestal') {
            return artPedestal(w, d, color, stroke, sw);
        }
        if (symbol === 'microwave') {
            return artMicrowave(w, d, color, stroke, sw);
        }
        if (symbol === 'oven') {
            return artOven(w, d, color, stroke, sw);
        }
        if (symbol === 'highchair') {
            return artHighchair(w, d, color, stroke, sw);
        }
        if (symbol === 'planter') {
            return artPlanter(w, d, color, stroke, sw);
        }
        if (symbol === 'hammock') {
            return artHammock(w, d, color, stroke, sw);
        }
        if (symbol === 'rug-round') {
            return artRugRound(w, d, color, stroke, sw);
        }
        if (symbol === 'coat') {
            return artCoat(w, d, color, stroke, sw);
        }
        if (symbol === 'dogbed') {
            return artDogbed(w, d, color, stroke, sw);
        }
        if (symbol === 'crate') {
            return artCrate(w, d, color, stroke, sw);
        }
        if (symbol === 'cat') {
            return artCat(w, d, color, stroke, sw);
        }
        if (symbol === 'box') {
            return artBox(w, d, color, stroke, sw);
        }
        if (symbol === 'stove') {
            return artStove(w, d, color, stroke, sw);
        }
        if (symbol === 'radiator') {
            return artRadiator(w, d, color, stroke, sw);
        }
        if (symbol === 'divider') {
            return artDivider(w, d, color, stroke, sw);
        }
        if (symbol === 'washer') {
            return artWasher(w, d, color, stroke, sw, false);
        }
        if (symbol === 'dryer') {
            return artWasher(w, d, color, stroke, sw, true);
        }
        if (symbol === 'iron') {
            return artIron(w, d, color, stroke, sw);
        }
        if (symbol === 'treadmill') {
            return artTreadmill(w, d, color, stroke, sw);
        }
        if (symbol === 'bike') {
            return artBike(w, d, color, stroke, sw);
        }
        if (symbol === 'rower') {
            return artRower(w, d, color, stroke, sw);
        }
        if (symbol === 'weights') {
            return artWeights(w, d, color, stroke, sw);
        }
        if (symbol === 'pool') {
            return artPool(w, d, color, stroke, sw);
        }
        if (symbol === 'pingpong') {
            return artPing(w, d, color, stroke, sw);
        }
        if (symbol === 'foosball') {
            return artFoos(w, d, color, stroke, sw);
        }
        if (symbol === 'piano') {
            return artPiano(w, d, color, stroke, sw);
        }
        if (symbol === 'grand') {
            return artGrand(w, d, color, stroke, sw);
        }
        if (symbol === 'keyboard') {
            return artKeyboard(w, d, color, stroke, sw);
        }
        if (symbol === 'easel') {
            return artEasel(w, d, color, stroke, sw);
        }
        if (symbol === 'aquarium') {
            return artAquarium(w, d, color, stroke, sw);
        }
        if (symbol === 'picnic') {
            return artPicnic(w, d, color, stroke, sw);
        }
        if (symbol === 'cellar') {
            return artCellar(w, d, color, stroke, sw);
        }
        if (symbol === 'car') {
            return artCar(w, d, color, stroke, sw);
        }
        if (symbol === 'swing') {
            return artSwing(w, d, color, stroke, sw);
        }
        return artPlain(w, d, color, stroke, sw);
    }

    document.querySelectorAll('[data-room-builder]').forEach(boot);

    function isFullscreen(root) {
        return root.getAttribute('data-layout') === 'fullscreen';
    }

    function boot(root) {
        bootCount += 1;
        var clipId = 'rb-floor-' + bootCount;
        var state = loadState();
        var nextId = 1;
        var drag = null;
        var ghost = null;
        var widthInput;
        var depthInput;
        var doorButton;
        var doorwayButton;
        var windowButton;
        var stairButton;
        var stairDownButton;
        var customWallButton;
        var viewZoom = 1;
        var viewOrigin = null;
        var wallNote;
        var stage;
        var svg;
        var view3d;
        var view3dButton;
        var view3dOn = false;
        var orbit = { yaw: -0.55, pitch: 0.58, dist: 28 };
        var orbitDrag = null;
        var hintEl;
        var statusEl;
        var selectionEl;
        var paletteEl;
        var findInput;
        var paletteQuery = '';
        var account = {
            user: null,
            nonce: '',
            restUrl: '',
            plans: [],
            lastPlanId: 0,
            timer: 0,
            statusTimer: 0,
            busy: false,
            mode: 'register',
            saveAsNew: false,
            statusText: '',
            statusKind: ''
        };
        var accountNameEl;
        var accountStatusEl;
        var saveButton;
        var loginButton;
        var roomsButton;
        var logoutButton;
        var modal;
        var dialog;
        var formErrorEl;
        var undoStack = [];
        var lastRecorded = null;
        var undoButton;
        var levelBar;

        adoptIds();
        readAccountConfig();

        if (isFullscreen(root)) {
            if (root.parentNode !== document.documentElement) {
                document.documentElement.appendChild(root);
            }
            document.documentElement.classList.add('room-builder-fullscreen');
        }

        var app = document.createElement('div');
        app.className = 'room-builder__app';
        root.innerHTML = '';
        root.appendChild(app);
        root.setAttribute('data-ready', 'true');

        buildToolbar();
        buildLevels();
        buildWorkspace();
        syncShapeButtons();
        syncDoorTool();
        syncSizeInputs();
        renderPalette();
        renderPlan();
        renderSelection();
        renderLevels();
        setStatus('');

        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('afterprint', removePrintSheet);
        noteHistory();
        resumeAccount();

        function loadState() {
            try {
                var raw = window.localStorage.getItem(STORAGE_KEY);
                var index;
                if (!raw) {
                    for (index = 0; index < LEGACY_KEYS.length; index += 1) {
                        raw = window.localStorage.getItem(LEGACY_KEYS[index]);
                        if (raw) {
                            break;
                        }
                    }
                }
                if (!raw) {
                    return blankState();
                }
                var parsed = JSON.parse(raw);
                var next = sanitize(parsed);
                next.planId = Number(parsed.planId) || 0;
                next.planTitle = typeof parsed.planTitle === 'string' ? parsed.planTitle.slice(0, 80) : '';
                next.dirty = !!parsed.dirty;
                return next;
            } catch (error) {
                return blankState();
            }
        }

        function cloneData(value) {
            return JSON.parse(JSON.stringify(value));
        }

        function levelName(kind) {
            if (kind === 'basement') {
                return 'Basement';
            }
            if (kind === 'second') {
                return 'Second story';
            }
            return 'First floor';
        }

        function blankLevel(kind) {
            return {
                id: kind,
                name: levelName(kind),
                kind: kind,
                room: roomFromTemplate(shapeTemplate('rectangle')),
                openings: [],
                items: [],
                stairs: [],
                catalog: 'living'
            };
        }

        function blankState() {
            var level = blankLevel('first');
            return {
                version: 3,
                levels: [level],
                activeLevelId: 'first',
                room: cloneData(level.room),
                openings: [],
                items: [],
                stairs: [],
                catalog: 'living',
                selected: null,
                group: [],
                tool: 'select',
                planId: 0,
                planTitle: '',
                dirty: false
            };
        }

        function findLevel(id) {
            var index;
            for (index = 0; index < state.levels.length; index += 1) {
                if (state.levels[index].id === id) {
                    return state.levels[index];
                }
            }
            return null;
        }

        function levelRank(kind) {
            if (kind === 'basement') {
                return 0;
            }
            if (kind === 'second') {
                return 2;
            }
            return 1;
        }

        function sortLevels() {
            state.levels.sort(function (a, b) {
                return levelRank(a.kind) - levelRank(b.kind);
            });
        }

        function commitActiveLevel() {
            var level = findLevel(state.activeLevelId);
            if (!level) {
                return;
            }
            level.room = cloneData(state.room);
            level.openings = cloneData(state.openings);
            level.items = cloneData(state.items);
            level.stairs = cloneData(state.stairs || []);
            level.catalog = state.catalog;
        }

        function housePayload() {
            commitActiveLevel();
            return {
                version: 3,
                levels: cloneData(state.levels),
                activeLevelId: state.activeLevelId
            };
        }

        function activeLevelName() {
            var level = findLevel(state.activeLevelId);
            return level ? level.name : 'First floor';
        }

        function roomFromTemplate(template) {
            return {
                shape: template.id,
                kind: template.kind,
                width: template.width,
                depth: template.depth,
                cutW: template.cutW || 0,
                cutD: template.cutD || 0
            };
        }

        function fillRoom(next, data) {
            var width = Number(data && data.room && data.room.width);
            var depth = Number(data && data.room && data.room.depth);
            var kind = data && data.room && data.room.kind;
            var customPoints = data && data.room && data.room.points;
            var savedSegments = readSavedSegments(data && data.room);
            if (kind === 'custom' && savedSegments.length) {
                next.room = {
                    shape: 'custom',
                    kind: 'custom',
                    width: 0,
                    depth: 0,
                    cutW: 0,
                    cutD: 0,
                    points: [],
                    edgeIds: [],
                    segments: savedSegments
                };
                state = next;
                if (data && roomTab(data.catalog)) {
                    next.catalog = roomTab(data.catalog).id;
                }
                if (data && Array.isArray(data.openings)) {
                    data.openings.forEach(function (opening) {
                        if (!opening || !opening.wall) {
                            return;
                        }
                        if (!isFinite(Number(opening.offset)) || !isFinite(Number(opening.width))) {
                            return;
                        }
                        next.openings.push(readOpening(opening));
                    });
                }
                if (data && Array.isArray(data.items)) {
                    data.items.forEach(function (item) {
                        if (!item || !catalogItem(item.catalogId)) {
                            return;
                        }
                        next.items.push(copyPlacedItem(item, Number(item.x) || 0, Number(item.y) || 0));
                    });
                }
                state = next;
                applySegmentModel(true);
                return next;
            }
            if (kind === 'custom' && Array.isArray(customPoints) && customPoints.length >= 4) {
                var loadedPoints = [];
                var loadedIds = Array.isArray(data.room.edgeIds) ? data.room.edgeIds.map(String) : [];
                customPoints.forEach(function (point) {
                    if (!point || !isFinite(Number(point[0])) || !isFinite(Number(point[1]))) {
                        return;
                    }
                    loadedPoints.push([Number(point[0]), Number(point[1])]);
                });
                while (loadedIds.length < loadedPoints.length) {
                    loadedIds.push('e' + loadedIds.length);
                }
                loadedIds = loadedIds.slice(0, loadedPoints.length);
                if (loadedPoints.length >= 4 && !polygonProblem(loadedPoints)) {
                    var placed = normalizeOrigin(loadedPoints);
                    next.room = {
                        shape: 'custom',
                        kind: 'custom',
                        width: placed.width,
                        depth: placed.depth,
                        cutW: 0,
                        cutD: 0,
                        points: placed.points,
                        edgeIds: loadedIds,
                        segments: segmentsFromPolygon(placed.points, loadedIds)
                    };
                    state = next;
                    if (data && roomTab(data.catalog)) {
                        next.catalog = roomTab(data.catalog).id;
                    }
                    if (data && Array.isArray(data.openings)) {
                        data.openings.forEach(function (opening) {
                            if (!opening || !opening.wall) {
                                return;
                            }
                            if (!isFinite(Number(opening.offset)) || !isFinite(Number(opening.width))) {
                                return;
                            }
                            next.openings.push(readOpening(opening));
                        });
                    }
                    if (data && Array.isArray(data.items)) {
                        data.items.forEach(function (item) {
                            if (!item || !catalogItem(item.catalogId)) {
                                return;
                            }
                            next.items.push(copyPlacedItem(item, snap((Number(item.x) || 0) - placed.minX), snap((Number(item.y) || 0) - placed.minY)));
                        });
                    }
                    state = next;
                    normalizeOpenings();
                    normalizeItems();
                    return next;
                }
            }
            if (['rect', 'l', 'l2', 't'].indexOf(kind) === -1) {
                kind = 'rect';
            }
            if (isFinite(width) && isFinite(depth)) {
                next.room.kind = kind;
                next.room.shape = data.room.shape || (kind === 'rect' && width === depth ? 'square' : kind === 'rect' ? 'rectangle' : kind);
                next.room.width = width;
                next.room.depth = depth;
                next.room.cutW = Number(data.room.cutW) || 0;
                next.room.cutD = Number(data.room.cutD) || 0;
                tightenRoom(next.room);
            }
            if (data && roomTab(data.catalog)) {
                next.catalog = roomTab(data.catalog).id;
            }
            if (data && Array.isArray(data.openings)) {
                data.openings.forEach(function (opening) {
                    if (!opening || !opening.wall) {
                        return;
                    }
                    if (!isFinite(Number(opening.offset)) || !isFinite(Number(opening.width))) {
                        return;
                    }
                    next.openings.push(readOpening(opening));
                });
            }
            if (data && Array.isArray(data.items)) {
                data.items.forEach(function (item) {
                    if (!item || !catalogItem(item.catalogId)) {
                        return;
                    }
                    next.items.push(copyPlacedItem(item, Number(item.x) || 0, Number(item.y) || 0));
                });
            }
            state = next;
            normalizeOpenings();
            normalizeItems();
            return next;
        }

        function readLevelContent(raw) {
            var shell = blankState();
            var content;
            fillRoom(shell, raw || {});
            content = {
                id: 'first',
                name: 'First floor',
                kind: 'first',
                room: cloneData(shell.room),
                openings: cloneData(shell.openings),
                items: cloneData(shell.items),
                stairs: readStairs(raw && raw.stairs),
                catalog: shell.catalog
            };
            if (raw && raw.room && isFinite(Number(raw.room.originX))) {
                content.room.originX = snap(Number(raw.room.originX));
                content.room.originY = snap(Number(raw.room.originY) || 0);
            }
            return content;
        }

        function sanitizeHouse(data) {
            var order = ['basement', 'first', 'second'];
            var collected = {};
            var levels = [];
            var next;
            var active;
            var current;
            data.levels.forEach(function (raw) {
                var kind = raw && (raw.kind === 'basement' || raw.kind === 'first' || raw.kind === 'second' ? raw.kind : raw.id);
                var content;
                if (order.indexOf(kind) === -1 || collected[kind]) {
                    return;
                }
                content = readLevelContent(raw);
                content.id = kind;
                content.name = levelName(kind);
                content.kind = kind;
                collected[kind] = content;
            });
            if (!collected.first) {
                collected.first = blankLevel('first');
            }
            order.forEach(function (kind) {
                if (collected[kind]) {
                    levels.push(collected[kind]);
                }
            });
            active = data.activeLevelId;
            if (!collected[active]) {
                active = 'first';
            }
            current = collected[active];
            next = blankState();
            next.levels = levels;
            next.activeLevelId = active;
            next.room = cloneData(current.room);
            next.openings = cloneData(current.openings);
            next.items = cloneData(current.items);
            next.stairs = cloneData(current.stairs || []);
            next.catalog = current.catalog;
            state = next;
            return next;
        }

        function sanitize(data) {
            var next;
            if (data && Array.isArray(data.levels) && data.levels.length) {
                return sanitizeHouse(data);
            }
            next = blankState();
            fillRoom(next, data || {});
            next.levels = [{
                id: 'first',
                name: 'First floor',
                kind: 'first',
                room: cloneData(next.room),
                openings: cloneData(next.openings),
                items: cloneData(next.items),
                stairs: [],
                catalog: next.catalog
            }];
            next.activeLevelId = 'first';
            state = next;
            return next;
        }

        function copyPlacedItem(item, x, y) {
            var entry = catalogItem(item.catalogId);
            var limits = sizeLimits(entry);
            var saved = {
                id: String(item.id || uid('f')),
                catalogId: item.catalogId,
                x: x,
                y: y,
                rotation: normalizeRotation(item.rotation)
            };
            var width = Number(item.width);
            var depth = Number(item.depth);
            if (isFinite(width)) {
                width = snap(Math.min(limits.maxW, Math.max(limits.minW, width)));
                if (Math.abs(width - entry.width) > 0.01) {
                    saved.width = width;
                }
            }
            if (isFinite(depth)) {
                depth = snap(Math.min(limits.maxD, Math.max(limits.minD, depth)));
                if (Math.abs(depth - entry.depth) > 0.01) {
                    saved.depth = depth;
                }
            }
            if (item.form === 'curve' || item.form === 'cane' || item.form === 'straight') {
                if (item.form !== (entry.form || 'straight')) {
                    saved.form = item.form;
                }
            }
            if (isFinite(Number(item.height)) && entry && Math.abs(Number(item.height) - Number(entry.height)) > 0.05) {
                saved.height = placedHeight(item);
            }
            return saved;
        }

        function planSignature() {
            var payload = housePayload();
            return JSON.stringify({
                levels: payload.levels,
                activeLevelId: payload.activeLevelId
            });
        }

        function planTitleText() {
            var room = state.room;
            var shapeName = room.kind === 'custom' ? 'Custom' : shapeTemplate(room.shape).label;
            var level = activeLevelName();
            if (room.kind === 'custom' && (!room.points || room.points.length < 4)) {
                return level + ' · Custom · connect the wall ends';
            }
            return level + ' · ' + shapeName + ' · ' + formatFeet(room.width) + ' ft × ' + formatFeet(room.depth) + ' ft';
        }

        function paintUndo() {
            if (!undoButton) {
                return;
            }
            undoButton.disabled = undoStack.length === 0;
        }

        function recordChange() {
            var current = planSignature();
            if (lastRecorded === null) {
                lastRecorded = current;
                paintUndo();
                return;
            }
            if (current === lastRecorded) {
                return;
            }
            undoStack.push(lastRecorded);
            if (undoStack.length > 40) {
                undoStack.shift();
            }
            lastRecorded = current;
            paintUndo();
        }

        function noteHistory() {
            undoStack = [];
            lastRecorded = planSignature();
            paintUndo();
        }

        function undo() {
            var saved;
            var planId;
            var planTitle;
            var dirty;
            if (!undoStack.length) {
                return;
            }
            saved = JSON.parse(undoStack.pop());
            planId = state.planId;
            planTitle = state.planTitle;
            dirty = state.dirty;
            state = sanitize(saved);
            state.planId = planId || 0;
            state.planTitle = planTitle || '';
            state.dirty = !!dirty;
            state.selected = null;
            state.group = [];
            state.tool = 'select';
            adoptIds();
            lastRecorded = planSignature();
            persist({ history: false });
            syncDoorTool();
            syncSizeInputs();
            syncShapeButtons();
            renderPalette();
            renderPlan();
            renderSelection();
            renderLevels();
            paintUndo();
            setStatus('Undone.');
        }

        function pieceRows() {
            var counts = [];
            function add(label) {
                var index;
                for (index = 0; index < counts.length; index += 1) {
                    if (counts[index].label === label) {
                        counts[index].count += 1;
                        return;
                    }
                }
                counts.push({ label: label, count: 1 });
            }
            state.items.forEach(function (item) {
                var entry = catalogItem(item.catalogId);
                var size;
                if (!entry) {
                    return;
                }
                size = placedSize(item);
                add(entry.name + ' · ' + formatFeet(size.width) + ' × ' + formatFeet(size.depth) + ' ft');
            });
            state.openings.forEach(function (opening) {
                var name = opening.kind === 'window' ? 'Window' : opening.kind === 'doorway' ? 'Doorway' : 'Door';
                add(name + ' · ' + formatFeet(opening.width) + ' ft');
            });
            (state.stairs || []).forEach(function (stair) {
                add((stair.direction === 'down' ? 'Stairs down' : 'Stairs up') + ' · ' + formatFeet(STAIR_W) + ' × ' + formatFeet(STAIR_D) + ' ft');
            });
            if (!counts.length) {
                return ['No pieces yet.'];
            }
            return counts.map(function (row) {
                return row.count > 1 ? row.label + ' × ' + row.count : row.label;
            });
        }

        function cleanPlanSvg() {
            var selected = state.selected;
            var group = state.group;
            var clone;
            var clip;
            var clipIdExport;
            state.selected = null;
            state.group = [];
            renderPlan();
            clone = svg.cloneNode(true);
            state.selected = selected;
            state.group = group;
            renderPlan();
            Array.prototype.forEach.call(clone.querySelectorAll('.room-builder__selection, .room-builder__rotate, .room-builder__remove, .room-builder__wall-hit, .room-builder__wall-end, .room-builder__wall-curve, .room-builder__item-size'), function (node) {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
            clip = clone.querySelector('clipPath');
            if (clip) {
                clipIdExport = 'rb-export-' + String(Date.now()) + String(Math.floor(Math.random() * 10000));
                clip.setAttribute('id', clipIdExport);
                Array.prototype.forEach.call(clone.querySelectorAll('[clip-path]'), function (node) {
                    node.setAttribute('clip-path', 'url(#' + clipIdExport + ')');
                });
            }
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            clone.setAttribute('viewBox', fittedViewString());
            return clone;
        }

        function removePrintSheet() {
            var sheet = document.querySelector('.room-builder-print');
            if (sheet && sheet.parentNode) {
                sheet.parentNode.removeChild(sheet);
            }
        }

        function buildPrintSheet() {
            var sheet = document.createElement('div');
            var heading = document.createElement('h1');
            var detail = document.createElement('p');
            var plan = document.createElement('div');
            var pieces = document.createElement('h2');
            var list = document.createElement('ul');
            removePrintSheet();
            sheet.className = 'room-builder-print';
            heading.textContent = state.planTitle || 'Plan';
            detail.textContent = planTitleText();
            plan.className = 'room-builder-print__plan';
            plan.appendChild(cleanPlanSvg());
            pieces.textContent = 'Pieces';
            pieceRows().forEach(function (row) {
                var item = document.createElement('li');
                item.textContent = row;
                list.appendChild(item);
            });
            sheet.appendChild(heading);
            sheet.appendChild(detail);
            sheet.appendChild(plan);
            sheet.appendChild(pieces);
            sheet.appendChild(list);
            document.body.appendChild(sheet);
        }

        function downloadPlan() {
            var clone = cleanPlanSvg();
            var parts = (clone.getAttribute('viewBox') || '0 0 16 18').split(/[\s,]+/).map(Number);
            var x = parts[0];
            var y = parts[1];
            var width = parts[2];
            var height = parts[3];
            var rows = pieceRows();
            var line = 0.55;
            var cursor = y + height + 0.85;
            var svgNs = 'http://www.w3.org/2000/svg';
            var style = document.createElementNS(svgNs, 'style');
            var heading = document.createElementNS(svgNs, 'text');
            style.textContent = '.room-builder__floor{fill:#fbfffd}.room-builder__roof{fill:#8d938c;stroke:#8d938c;stroke-width:1.15;opacity:0.58}.room-builder__roof--slab{fill:#2f3833;stroke:#2f3833;stroke-width:0.55;opacity:0.5}.room-builder__grid line{stroke:rgba(15,118,110,0.2);stroke-width:0.025}.room-builder__wall{fill:none;stroke:#16332f;stroke-width:0.18;stroke-linecap:square}.room-builder__door{fill:none;stroke:#3d6f68;stroke-width:0.045}.room-builder__doorway{fill:none;stroke:#16332f;stroke-width:0.08}.room-builder__window{fill:none;stroke:#3d7ea6;stroke-width:0.055}.room-builder__stair{fill:#f4efe6;stroke:#16332f;stroke-width:0.06}.room-builder__stair--down{fill:#6d5c4e;stroke:#2c241c;stroke-width:0.07}.room-builder__wall-label,text{fill:#16332f;font-family:Segoe UI,Helvetica Neue,sans-serif}';
            clone.insertBefore(style, clone.firstChild);
            heading.setAttribute('x', String(x + 0.15));
            heading.setAttribute('y', String(cursor));
            heading.setAttribute('font-size', '0.42');
            heading.setAttribute('font-weight', '700');
            heading.textContent = (state.planTitle ? state.planTitle + ' · ' : '') + planTitleText();
            clone.appendChild(heading);
            cursor += 0.7;
            rows.forEach(function (row) {
                var label = document.createElementNS(svgNs, 'text');
                label.setAttribute('x', String(x + 0.15));
                label.setAttribute('y', String(cursor));
                label.setAttribute('font-size', '0.36');
                label.textContent = row;
                clone.appendChild(label);
                cursor += line;
            });
            clone.setAttribute('viewBox', [x, y, width, cursor - y + 0.3].join(' '));
            clone.setAttribute('width', '900');
            clone.setAttribute('height', String(Math.max(1, Math.round(900 * ((cursor - y + 0.3) / width)))));
            var blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' });
            var link = document.createElement('a');
            var base = (state.planTitle || 'plan').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            link.href = URL.createObjectURL(blob);
            link.download = (base || 'plan') + '.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.setTimeout(function () {
                URL.revokeObjectURL(link.href);
            }, 1000);
        }

        function fillSheet() {
            var planWrap = document.createElement('div');
            var list = document.createElement('ul');
            var actions = dialogActions();
            var print = makeButton('Print', 'room-builder__button room-builder__button--primary');
            var download = makeButton('Download', 'room-builder__button');
            var close = makeButton('Close', 'room-builder__button');
            planWrap.className = 'room-builder__sheet-plan';
            planWrap.appendChild(cleanPlanSvg());
            list.className = 'room-builder__sheet-list';
            pieceRows().forEach(function (row) {
                var item = document.createElement('li');
                item.textContent = row;
                list.appendChild(item);
            });
            print.addEventListener('click', function () {
                buildPrintSheet();
                window.print();
            });
            download.addEventListener('click', downloadPlan);
            close.addEventListener('click', closeModal);
            dialog.appendChild(dialogHeading(state.planTitle || 'Print this plan'));
            dialog.appendChild(dialogCopy(planTitleText()));
            dialog.appendChild(planWrap);
            dialog.appendChild(list);
            actions.appendChild(print);
            actions.appendChild(download);
            actions.appendChild(close);
            dialog.appendChild(actions);
        }

        function persist(options) {
            var remote = !options || options.remote !== false;
            if (!options || options.history !== false) {
                recordChange();
            }
            if (options && options.clean) {
                state.dirty = false;
            } else if (remote && account.user && state.planId) {
                state.dirty = true;
                account.generation = (account.generation || 0) + 1;
            }
            try {
                var payload = housePayload();
                payload.planId = state.planId || 0;
                payload.planTitle = state.planTitle || '';
                payload.dirty = !!state.dirty;
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            } catch (error) {
                setStatus('This browser could not save the plan.');
            }
            if (remote) {
                scheduleAccountSave();
            }
        }

        function uid(prefix) {
            var id = prefix + String(nextId);
            nextId += 1;
            return id;
        }

        function adoptIds() {
            var max = 0;
            var entries = [];
            function take(entry) {
                var match;
                if (!entry || entry.id === undefined || entry.id === null) {
                    return;
                }
                match = String(entry.id).match(/(\d+)$/);
                if (match) {
                    max = Math.max(max, Number(match[1]));
                }
            }
            state.levels.forEach(function (level) {
                var working = level.id === state.activeLevelId;
                var room = working ? state.room : level.room;
                var openings = working ? state.openings : level.openings;
                var items = working ? state.items : level.items;
                (items || []).forEach(take);
                (openings || []).forEach(take);
                (working ? (state.stairs || []) : (level.stairs || [])).forEach(take);
                ((room && room.segments) || []).forEach(take);
            });
            nextId = max + 1;
        }

        function readOpening(opening) {
            return {
                id: String(opening.id || uid('d')),
                wall: String(opening.wall),
                offset: Number(opening.offset),
                width: Number(opening.width),
                hinge: opening.hinge === 'end' ? 'end' : 'start',
                swing: opening.swing === 'out' ? 'out' : 'in',
                kind: opening.kind === 'doorway' || opening.kind === 'window' ? opening.kind : 'door'
            };
        }

        function readStairs(list) {
            var stairs = [];
            if (!Array.isArray(list)) {
                return stairs;
            }
            list.forEach(function (stair) {
                var rotation;
                if (!stair || !isFinite(Number(stair.x)) || !isFinite(Number(stair.y))) {
                    return;
                }
                rotation = normalizeRotation(stair.rotation);
                if (rotation !== 90 && rotation !== 180 && rotation !== 270) {
                    rotation = 0;
                }
                stairs.push({
                    id: String(stair.id || uid('s')),
                    x: snap(Number(stair.x)),
                    y: snap(Number(stair.y)),
                    rotation: rotation,
                    direction: stair.direction === 'down' ? 'down' : 'up'
                });
            });
            return stairs;
        }

        function findItem(id) {
            var index;
            for (index = 0; index < state.items.length; index += 1) {
                if (state.items[index].id === id) {
                    return state.items[index];
                }
            }
            return null;
        }

        function findOpening(id) {
            var index;
            for (index = 0; index < state.openings.length; index += 1) {
                if (state.openings[index].id === id) {
                    return state.openings[index];
                }
            }
            return null;
        }

        function minRoomSize() {
            return state.room.kind === 'rect' ? MIN_ROOM : MIN_SHAPED;
        }

        function tightenRoom(room) {
            var minSize = room.kind === 'rect' ? MIN_ROOM : MIN_SHAPED;
            room.width = Math.min(MAX_ROOM, Math.max(minSize, snap(room.width)));
            room.depth = Math.min(MAX_ROOM, Math.max(minSize, snap(room.depth)));
            if (room.kind === 'rect') {
                room.cutW = 0;
                room.cutD = 0;
                return;
            }
            var cutW = snap(room.cutW);
            var cutD = snap(room.cutD);
            if (room.kind === 't') {
                cutW = Math.min(Math.max(cutW, 4), room.width - 8);
                cutD = Math.min(Math.max(cutD, 4), room.depth - 4);
            } else {
                cutW = Math.min(Math.max(cutW, 4), room.width - 4);
                cutD = Math.min(Math.max(cutD, 4), room.depth - 4);
            }
            room.cutW = cutW;
            room.cutD = cutD;
        }

        function copyPoints(points) {
            return points.map(function (point) {
                return [point[0], point[1]];
            });
        }

        function edgeAxis(a, b) {
            var dx = b[0] - a[0];
            var dy = b[1] - a[1];
            if (Math.abs(dy) <= 0.05 && Math.abs(dx) > 0.05) {
                return 'h';
            }
            if (Math.abs(dx) <= 0.05 && Math.abs(dy) > 0.05) {
                return 'v';
            }
            if (Math.abs(Math.abs(dx) - Math.abs(dy)) <= 0.08 && Math.abs(dx) > 0.05) {
                return dx * dy > 0 ? 'd' : 'd2';
            }
            return '';
        }

        function segmentLength(a, b) {
            return Math.hypot(b[0] - a[0], b[1] - a[1]);
        }

        function orient(p, q, r) {
            var value = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
            if (Math.abs(value) < 0.000001) {
                return 0;
            }
            return value > 0 ? 1 : -1;
        }

        function onSegment(p, q, r) {
            return r[0] <= Math.max(p[0], q[0]) + 0.000001 && r[0] >= Math.min(p[0], q[0]) - 0.000001 && r[1] <= Math.max(p[1], q[1]) + 0.000001 && r[1] >= Math.min(p[1], q[1]) - 0.000001;
        }

        function segmentsCross(a, b, c, d) {
            var o1 = orient(a, b, c);
            var o2 = orient(a, b, d);
            var o3 = orient(c, d, a);
            var o4 = orient(c, d, b);
            if (o1 !== o2 && o3 !== o4) {
                return true;
            }
            if (o1 === 0 && onSegment(a, b, c)) {
                return true;
            }
            if (o2 === 0 && onSegment(a, b, d)) {
                return true;
            }
            if (o3 === 0 && onSegment(c, d, a)) {
                return true;
            }
            if (o4 === 0 && onSegment(c, d, b)) {
                return true;
            }
            return false;
        }

        function polygonProblem(points) {
            var count = points.length;
            var index;
            var other;
            var start;
            var end;
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            if (count < 4) {
                return 'A room needs at least four walls.';
            }
            for (index = 0; index < count; index += 1) {
                start = points[index];
                end = points[(index + 1) % count];
                if (!edgeAxis(start, end)) {
                    return 'Walls turn in 45° steps.';
                }
                if (segmentLength(start, end) < MIN_WALL - 0.001) {
                    return 'Each wall needs to be at least ' + MIN_WALL + ' ft.';
                }
                minX = Math.min(minX, start[0]);
                minY = Math.min(minY, start[1]);
                maxX = Math.max(maxX, start[0]);
                maxY = Math.max(maxY, start[1]);
            }
            if (maxX - minX > MAX_ROOM + 0.001 || maxY - minY > MAX_ROOM + 0.001) {
                return 'Rooms stay within ' + MAX_ROOM + ' ft on each side.';
            }
            if (maxX - minX < MIN_ROOM - 0.001 || maxY - minY < MIN_ROOM - 0.001) {
                return 'The room needs to stay at least ' + MIN_ROOM + ' ft on each side.';
            }
            for (index = 0; index < count; index += 1) {
                for (other = index + 1; other < count; other += 1) {
                    if (other === index || (other + 1) % count === index || (index + 1) % count === other) {
                        continue;
                    }
                    if (segmentsCross(points[index], points[(index + 1) % count], points[other], points[(other + 1) % count])) {
                        return 'That wall would cross another wall.';
                    }
                }
            }
            return '';
        }

        function normalizeOrigin(points) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            points.forEach(function (point) {
                minX = Math.min(minX, point[0]);
                minY = Math.min(minY, point[1]);
                maxX = Math.max(maxX, point[0]);
                maxY = Math.max(maxY, point[1]);
            });
            return {
                minX: minX,
                minY: minY,
                width: snap(maxX - minX),
                depth: snap(maxY - minY),
                points: points.map(function (point) {
                    return [snap(point[0] - minX), snap(point[1] - minY)];
                })
            };
        }

        function pointInPoly(x, y, poly) {
            var inside = false;
            var index;
            var previous = poly.length - 1;
            var currentX;
            var currentY;
            var previousX;
            var previousY;
            for (index = 0; index < poly.length; index += 1) {
                currentX = poly[index][0];
                currentY = poly[index][1];
                previousX = poly[previous][0];
                previousY = poly[previous][1];
                if (((currentY > y) !== (previousY > y)) && (x < (previousX - currentX) * (y - currentY) / ((previousY - currentY) || 0.000001) + currentX)) {
                    inside = !inside;
                }
                previous = index;
            }
            return inside;
        }

        function distToSegment(px, py, a, b) {
            var dx = b[0] - a[0];
            var dy = b[1] - a[1];
            var len2 = dx * dx + dy * dy || 1;
            var t = ((px - a[0]) * dx + (py - a[1]) * dy) / len2;
            t = Math.max(0, Math.min(1, t));
            return Math.hypot(px - (a[0] + dx * t), py - (a[1] + dy * t));
        }

        function pointNearPoly(x, y, poly) {
            var index;
            if (pointInPoly(x, y, poly)) {
                return true;
            }
            for (index = 0; index < poly.length; index += 1) {
                if (distToSegment(x, y, poly[index], poly[(index + 1) % poly.length]) <= 0.02) {
                    return true;
                }
            }
            return false;
        }

        function boxInHouse(x, y, width, depth) {
            var faces = layout().faces || [];
            var index;
            if (width <= 0 || depth <= 0) {
                return false;
            }
            for (index = 0; index < faces.length; index += 1) {
                if (faces[index].length >= 3 && rectInPolygon(x, y, width, depth, faces[index])) {
                    return true;
                }
            }
            return false;
        }

        function rectInPolygon(x, y, width, height, poly) {
            var step = 0.5;
            var sx;
            var sy;
            var sampleX;
            var sampleY;
            if (!pointNearPoly(x + width / 2, y + height / 2, poly)) {
                return false;
            }
            for (sy = y; sy <= y + height + 0.001; sy += step) {
                for (sx = x; sx <= x + width + 0.001; sx += step) {
                    sampleX = Math.min(sx, x + width);
                    sampleY = Math.min(sy, y + height);
                    if (!pointNearPoly(sampleX, sampleY, poly)) {
                        return false;
                    }
                }
            }
            return pointNearPoly(x, y, poly) && pointNearPoly(x + width, y, poly) && pointNearPoly(x, y + height, poly) && pointNearPoly(x + width, y + height, poly);
        }

        function layout() {
            var room = state.room;
            var width = room.width;
            var depth = room.depth;
            var cutW = room.cutW;
            var cutD = room.cutD;
            var polygon;
            var cutouts = [];
            var shoulder;

            if (room.kind === 'custom') {
                polygon = room.points && room.points.length >= 4 ? room.points.map(function (point) {
                    return [point[0], point[1]];
                }) : [];
                width = room.width;
                depth = room.depth;
            } else if (room.kind === 'l') {
                polygon = [
                    [0, 0],
                    [width - cutW, 0],
                    [width - cutW, cutD],
                    [width, cutD],
                    [width, depth],
                    [0, depth]
                ];
                cutouts = [{ x: width - cutW, y: 0, w: cutW, h: cutD }];
            } else if (room.kind === 'l2') {
                polygon = [
                    [cutW, 0],
                    [width, 0],
                    [width, depth],
                    [0, depth],
                    [0, cutD],
                    [cutW, cutD]
                ];
                cutouts = [{ x: 0, y: 0, w: cutW, h: cutD }];
            } else if (room.kind === 't') {
                shoulder = (width - cutW) / 2;
                polygon = [
                    [0, 0],
                    [width, 0],
                    [width, cutD],
                    [shoulder + cutW, cutD],
                    [shoulder + cutW, depth],
                    [shoulder, depth],
                    [shoulder, cutD],
                    [0, cutD]
                ];
                cutouts = [
                    { x: 0, y: cutD, w: shoulder, h: depth - cutD },
                    { x: shoulder + cutW, y: cutD, w: shoulder, h: depth - cutD }
                ];
            } else {
                polygon = [[0, 0], [width, 0], [width, depth], [0, depth]];
            }

            var used = {};
            var walls = polygon.map(function (point, index) {
                var next = polygon[(index + 1) % polygon.length];
                var horizontal = Math.abs(point[1] - next[1]) < 0.001;
                var reversed = horizontal ? point[0] > next[0] : point[1] > next[1];
                var x1 = point[0];
                var y1 = point[1];
                var x2 = next[0];
                var y2 = next[1];
                if (horizontal && x1 > x2) {
                    x1 = next[0];
                    x2 = point[0];
                }
                if (!horizontal && y1 > y2) {
                    y1 = next[1];
                    y2 = point[1];
                }
                var id;
                var source;
                var bulge = 0;
                var chord;
                if (room.kind === 'custom' && room.edgeIds && room.edgeIds[index]) {
                    id = room.edgeIds[index];
                } else if (horizontal && Math.abs(y1) < 0.01) {
                    id = 'north';
                } else if (horizontal && Math.abs(y1 - depth) < 0.01) {
                    id = 'south';
                } else if (!horizontal && Math.abs(x1) < 0.01) {
                    id = 'west';
                } else if (!horizontal && Math.abs(x1 - width) < 0.01) {
                    id = 'east';
                } else {
                    id = 'w' + index;
                }
                if (room.kind !== 'custom' && used[id]) {
                    id = id + '-' + index;
                }
                used[id] = true;
                source = (room.segments || []).filter(function (segment) {
                    return segment.id === id;
                })[0];
                if (source) {
                    x1 = source.x1;
                    y1 = source.y1;
                    x2 = source.x2;
                    y2 = source.y2;
                    bulge = source.bulge || 0;
                    horizontal = Math.abs(y1 - y2) <= 0.001 && Math.abs(x2 - x1) > 0.001;
                }
                chord = Math.hypot(x2 - x1, y2 - y1);
                return {
                    id: id,
                    index: index,
                    reversed: reversed,
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    bulge: bulge,
                    length: arcLengthOf(chord, bulge),
                    horizontal: horizontal
                };
            });

            var faces = [];
            if (room.kind === 'custom' && room.faces && room.faces.length) {
                faces = room.faces.map(function (face) {
                    return (face || []).map(function (point) {
                        return [point[0], point[1]];
                    });
                }).filter(function (face) {
                    return face.length >= 4;
                });
            } else if (polygon.length >= 4) {
                faces = [polygon];
            }

            return {
                polygon: polygon,
                walls: walls,
                cutouts: cutouts,
                faces: faces
            };
        }

        function wallFromSegment(segment) {
            var chord = segmentSpan(segment);
            if (chord < 0.001 || !segmentDirectionOk(segment)) {
                return null;
            }
            return {
                id: segment.id,
                index: -1,
                reversed: false,
                x1: segment.x1,
                y1: segment.y1,
                x2: segment.x2,
                y2: segment.y2,
                bulge: segment.bulge || 0,
                length: arcLengthOf(chord, segment.bulge || 0),
                horizontal: Math.abs(segment.y1 - segment.y2) <= 0.001 && Math.abs(segment.x2 - segment.x1) > 0.001
            };
        }

        function allWalls() {
            var walls = layout().walls.slice();
            var seen = {};
            walls.forEach(function (wall) {
                seen[wall.id] = true;
            });
            (state.room.segments || []).forEach(function (segment) {
                var wall;
                if (seen[segment.id]) {
                    return;
                }
                wall = wallFromSegment(segment);
                if (wall) {
                    walls.push(wall);
                    seen[wall.id] = true;
                }
            });
            return walls;
        }

        function findWall(id) {
            var walls = allWalls();
            var index;
            for (index = 0; index < walls.length; index += 1) {
                if (walls[index].id === id) {
                    return walls[index];
                }
            }
            return null;
        }

        function wallLength(id) {
            var wall = findWall(id);
            return wall ? wall.length : 0;
        }

        function rectHitsCutout(x, y, width, depth, cut) {
            return x < cut.x + cut.w - 0.02 && x + width > cut.x + 0.02 && y < cut.y + cut.h - 0.02 && y + depth > cut.y + 0.02;
        }

        function boxesHit(boxes, x, y, w, d) {
            return boxes.some(function (box) {
                return rectsOverlap(box.x, box.y, box.w, box.d, x, y, w, d);
            });
        }

        function itemInside(item, ignore) {
            var boxes = occupiedWorld(item);
            var index;
            for (index = 0; index < boxes.length; index += 1) {
                if (!boxInHouse(boxes[index].x, boxes[index].y, boxes[index].w, boxes[index].d)) {
                    return false;
                }
            }
            return !itemBlocksPassage(item) && !itemOverlaps(item, ignore);
        }

        function pointInside(x, y) {
            var plan = layout();
            if (state.room.kind === 'custom') {
                return pointInPoly(x, y, plan.polygon);
            }
            if (x < -0.05 || y < -0.05 || x > state.room.width + 0.05 || y > state.room.depth + 0.05) {
                return false;
            }
            return !plan.cutouts.some(function (cut) {
                return x > cut.x + 0.05 && x < cut.x + cut.w - 0.05 && y > cut.y + 0.05 && y < cut.y + cut.h - 0.05;
            });
        }

        function nudgeInside(item) {
            var startX = item.x;
            var startY = item.y;
            var radius;
            var dx;
            var dy;
            if (itemInside(item)) {
                return true;
            }
            for (radius = 0.5; radius <= 4; radius += 0.5) {
                for (dx = -radius; dx <= radius; dx += 0.5) {
                    for (dy = -radius; dy <= radius; dy += 0.5) {
                        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) {
                            continue;
                        }
                        item.x = snap(startX + dx);
                        item.y = snap(startY + dy);
                        if (itemInside(item)) {
                            return true;
                        }
                    }
                }
            }
            item.x = startX;
            item.y = startY;
            return false;
        }

        function findSpot(item, preferred) {
            var size = footprint(item);
            var y;
            var x;
            if (preferred) {
                item.x = snap(preferred.x);
                item.y = snap(preferred.y);
                if (itemInside(item)) {
                    return true;
                }
            }
            var spot = segmentBounds(state.room.kind === 'custom' ? (state.room.segments || []) : []);
            var spotMinX = state.room.kind === 'custom' ? spot.minX : 0;
            var spotMinY = state.room.kind === 'custom' ? spot.minY : 0;
            var spotMaxX = state.room.kind === 'custom' ? spot.minX + spot.width : state.room.width;
            var spotMaxY = state.room.kind === 'custom' ? spot.minY + spot.depth : state.room.depth;
            for (y = spotMinY; y <= spotMaxY - size.d + 0.001; y += 1) {
                for (x = spotMinX; x <= spotMaxX - size.w + 0.001; x += 1) {
                    item.x = x;
                    item.y = y;
                    if (itemInside(item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function overlapsOpening(wall, offset, width, ignoreId) {
            return state.openings.some(function (opening) {
                if (opening.id === ignoreId || opening.wall !== wall) {
                    return false;
                }
                return offset < opening.offset + opening.width - 0.01 && offset + width > opening.offset + 0.01;
            });
        }

        function rectsOverlap(ax, ay, aw, ad, bx, by, bw, bd) {
            return ax < bx + bw - 0.02 && ax + aw > bx + 0.02 && ay < by + bd - 0.02 && ay + ad > by + 0.02;
        }

        function isRugItem(item) {
            var entry = item && catalogItem(item.catalogId);
            return !!(entry && entry.kind === 'rug');
        }

        function itemOverlaps(item, ignore) {
            var rug = isRugItem(item);
            var mine = occupiedWorld(item);
            var blocked = false;
            state.items.forEach(function (other) {
                var otherRug;
                if (blocked || other.id === item.id || (ignore && ignore[other.id])) {
                    return;
                }
                otherRug = isRugItem(other);
                if ((rug || otherRug) && !(rug && otherRug)) {
                    return;
                }
                if (occupiedWorld(other).some(function (box) {
                    return boxesHit(mine, box.x, box.y, box.w, box.d);
                })) {
                    blocked = true;
                }
            });
            if (blocked || rug) {
                return blocked;
            }
            (state.stairs || []).forEach(function (stair) {
                var box;
                if (blocked || stair.id === item.id || (ignore && ignore[stair.id])) {
                    return;
                }
                box = stairBox(stair);
                if (boxesHit(mine, stair.x, stair.y, box.w, box.d)) {
                    blocked = true;
                }
            });
            return blocked;
        }

        function overlapsPieces(x, y, w, d, selfId, rug, ignore) {
            var blocked = false;
            state.items.forEach(function (other) {
                var otherRug;
                if (blocked || other.id === selfId || (ignore && ignore[other.id])) {
                    return;
                }
                otherRug = isRugItem(other);
                if ((rug || otherRug) && !(rug && otherRug)) {
                    return;
                }
                if (boxesHit(occupiedWorld(other), x, y, w, d)) {
                    blocked = true;
                }
            });
            if (blocked || rug) {
                return blocked;
            }
            (state.stairs || []).forEach(function (stair) {
                var box;
                if (blocked || stair.id === selfId || (ignore && ignore[stair.id])) {
                    return;
                }
                box = stairBox(stair);
                if (rectsOverlap(x, y, w, d, stair.x, stair.y, box.w, box.d)) {
                    blocked = true;
                }
            });
            return blocked;
        }

        function openingName(opening) {
            if (opening && opening.kind === 'window') {
                return 'Window';
            }
            if (opening && opening.kind === 'doorway') {
                return 'Doorway';
            }
            return 'Door';
        }

        function boundsOf(points) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            points.forEach(function (point) {
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
            });
            return { x: minX, y: minY, w: Math.max(0.2, maxX - minX), h: Math.max(0.2, maxY - minY) };
        }

        function openingZones(opening) {
            var wall = findWall(opening.wall);
            var kind = opening.kind || 'door';
            var inward;
            var depth;
            var hingeAtEnd;
            var start;
            var endPoint;
            var hinge;
            var closed;
            var open;
            if (!wall || kind === 'window') {
                return [];
            }
            inward = inwardNormal(wall);
            start = pointAlongWall(wall, opening.offset);
            endPoint = pointAlongWall(wall, opening.offset + opening.width);
            if (kind === 'door' && opening.swing !== 'out') {
                hingeAtEnd = opening.hinge === 'end';
                hinge = hingeAtEnd ? endPoint : start;
                closed = hingeAtEnd ? start : endPoint;
                open = {
                    x: hinge.x + inward.x * opening.width,
                    y: hinge.y + inward.y * opening.width
                };
                return [boundsOf([
                    hinge,
                    closed,
                    open,
                    { x: closed.x + inward.x * opening.width, y: closed.y + inward.y * opening.width }
                ])];
            }
            depth = Math.min(PASSAGE, opening.width);
            return [boundsOf([
                start,
                endPoint,
                { x: endPoint.x + inward.x * depth, y: endPoint.y + inward.y * depth },
                { x: start.x + inward.x * depth, y: start.y + inward.y * depth }
            ])];
        }

        function coversPassage(x, y, w, d) {
            if (!state.openings) {
                return false;
            }
            return state.openings.some(function (opening) {
                return openingZones(opening).some(function (zone) {
                    return rectsOverlap(x, y, w, d, zone.x, zone.y, zone.w, zone.h);
                });
            });
        }

        function itemBlocksPassage(item) {
            var entry = catalogItem(item.catalogId);
            if (!entry || entry.kind === 'rug') {
                return false;
            }
            return occupiedWorld(item).some(function (box) {
                return coversPassage(box.x, box.y, box.w, box.d);
            });
        }

        function openingBlockedByFurniture(opening) {
            return state.items.some(function (item) {
                var entry = catalogItem(item.catalogId);
                if (!entry || entry.kind === 'rug') {
                    return false;
                }
                return occupiedWorld(item).some(function (box) {
                    return openingZones(opening).some(function (zone) {
                        return rectsOverlap(box.x, box.y, box.w, box.d, zone.x, zone.y, zone.w, zone.h);
                    });
                });
            });
        }

        function normalizeOpenings() {
            var kept = [];
            state.openings.forEach(function (opening) {
                var length = wallLength(opening.wall);
                var width = snap(opening.width);
                if (length < 2 || width < 2) {
                    return;
                }
                width = Math.min(width, length);
                var offset = snap(opening.offset);
                offset = Math.max(0, Math.min(offset, length - width));
                var blocked = kept.some(function (other) {
                    return other.wall === opening.wall && offset < other.offset + other.width - 0.01 && offset + width > other.offset + 0.01;
                });
                if (blocked) {
                    return;
                }
                opening.width = width;
                opening.offset = offset;
                kept.push(opening);
            });
            state.openings = kept;
        }

        function normalizeItems() {
            state.items = state.items.filter(function (item) {
                if (!catalogItem(item.catalogId)) {
                    return false;
                }
                return itemInside(item) || nudgeInside(item);
            });
            (state.stairs || []).forEach(function (stair) {
                if (!stairInside(stair)) {
                    nudgeStair(stair);
                }
            });
        }

        function readAccountConfig() {
            var cfg = window.roomBuilderAccount || {};
            account.nonce = cfg.nonce || '';
            account.restUrl = cfg.restUrl || '';
            account.user = cfg.loggedIn && cfg.user ? cfg.user : null;
            account.plans = Array.isArray(cfg.plans) ? cfg.plans : [];
            account.lastPlanId = Number(cfg.lastPlanId) || 0;
        }

        function accountUrl(path) {
            var root = account.restUrl || '';
            if (root.charAt(root.length - 1) !== '/') {
                root += '/';
            }
            return root + path;
        }

        function accountRequest(path, options) {
            var opts = options || {};
            if (!account.restUrl) {
                return Promise.reject(new Error('Saving is unavailable on this page.'));
            }
            opts.credentials = 'same-origin';
            opts.headers = {
                'Content-Type': 'application/json',
                'X-WP-Nonce': account.nonce
            };
            return fetch(accountUrl(path), opts).then(function (response) {
                return response.text().then(function (text) {
                    var body = {};
                    if (text) {
                        try {
                            body = JSON.parse(text);
                        } catch (error) {
                            body = {};
                        }
                    }
                    if (!response.ok) {
                        throw new Error(body && body.message ? body.message : 'Something went wrong. Try again.');
                    }
                    return body;
                });
            }).catch(function (error) {
                if (!error || error.message === 'Failed to fetch') {
                    throw new Error('The site could not be reached.');
                }
                throw error;
            });
        }

        function applySession(payload) {
            if (!payload) {
                return;
            }
            if (payload.nonce) {
                account.nonce = payload.nonce;
            }
            account.user = payload.loggedIn && payload.user ? payload.user : null;
            account.plans = Array.isArray(payload.plans) ? payload.plans : [];
            account.lastPlanId = Number(payload.lastPlanId) || 0;
            if (window.roomBuilderAccount) {
                window.roomBuilderAccount.nonce = account.nonce;
                window.roomBuilderAccount.loggedIn = !!account.user;
                window.roomBuilderAccount.user = account.user;
                window.roomBuilderAccount.plans = account.plans;
                window.roomBuilderAccount.lastPlanId = account.lastPlanId;
            }
            renderAccount();
        }

        function ownsPlan(id) {
            var index;
            id = Number(id);
            for (index = 0; index < account.plans.length; index += 1) {
                if (Number(account.plans[index].id) === id) {
                    return true;
                }
            }
            return false;
        }

        function planIsBlank() {
            var room;
            commitActiveLevel();
            if (!state.levels || state.levels.length !== 1 || state.levels[0].kind !== 'first') {
                return false;
            }
            room = state.room;
            if (state.items.length || state.openings.length || (state.stairs && state.stairs.length)) {
                return false;
            }
            if (!room || room.kind !== 'rect') {
                return false;
            }
            return Math.abs(room.width - 12) < 0.01 && Math.abs(room.depth - 14) < 0.01;
        }

        function snapshot() {
            return housePayload();
        }

        function resumeAccount() {
            renderAccount();
            if (!account.restUrl) {
                return;
            }
            accountRequest('session', { method: 'GET' }).then(function (body) {
                applySession(body);
                decideResume();
            }).catch(function () {
                decideResume();
            });
        }

        function decideResume() {
            var localId = Number(state.planId) || 0;
            if (!account.user) {
                renderAccount();
                return;
            }
            if (localId && !ownsPlan(localId)) {
                state.planId = 0;
                state.planTitle = '';
                state.dirty = false;
                persist({ remote: false, clean: true });
                localId = 0;
            }
            if (localId && ownsPlan(localId) && state.dirty) {
                accountStatus('Saving…');
                updatePlan(localId, state.planTitle, true);
                return;
            }
            if (localId && ownsPlan(localId)) {
                loadPlan(localId, true);
                return;
            }
            if (planIsBlank() && account.lastPlanId && ownsPlan(account.lastPlanId)) {
                loadPlan(account.lastPlanId, true);
                return;
            }
                if (!planIsBlank()) {
                    setStatus('This house is only on this browser. Save it to your account to keep it.');
                }
            renderAccount();
        }

        function scheduleAccountSave() {
            if (!account.user || !state.planId) {
                return;
            }
            window.clearTimeout(account.timer);
            account.timer = window.setTimeout(flushAccountSave, 1200);
        }

        function flushAccountSave() {
            if (!account.user || !state.planId) {
                return;
            }
            if (account.busy) {
                account.timer = window.setTimeout(flushAccountSave, 400);
                return;
            }
            updatePlan(state.planId, state.planTitle, true);
        }

        function createPlan(title) {
            var generation;
            if (account.busy) {
                return Promise.resolve();
            }
            var sent;
            account.busy = true;
            generation = account.generation || 0;
            sent = JSON.stringify(snapshot());
            accountStatus('Saving…');
            renderAccount();
            return accountRequest('plans', {
                method: 'POST',
                body: JSON.stringify({
                    title: title || 'My plan',
                    plan: snapshot()
                })
            }).then(function (body) {
                state.planId = Number(body.id) || 0;
                state.planTitle = body.title || title || 'My plan';
                account.plans = Array.isArray(body.plans) ? body.plans : account.plans;
                account.lastPlanId = Number(body.lastPlanId) || state.planId;
                if ((account.generation || 0) === generation) {
                    persist({ remote: false, clean: true });
                } else {
                    persist({ remote: false });
                }
                if (JSON.stringify(snapshot()) !== sent) {
                    scheduleAccountSave();
                }
                accountStatus('Saved');
                setStatus('Saved. This plan will be here when you come back.');
                renderAccount();
            }).catch(function (error) {
                accountStatus(error.message, 'alert');
                setStatus(error.message);
            }).then(function () {
                account.busy = false;
                renderAccount();
            });
        }

        function updatePlan(id, title, automatic) {
            var generation;
            if (account.busy) {
                return Promise.resolve();
            }
            account.busy = true;
            generation = account.generation || 0;
            accountStatus('Saving…');
            return accountRequest('plans/' + id, {
                method: 'PUT',
                body: JSON.stringify({
                    title: title || 'My plan',
                    plan: snapshot()
                })
            }).then(function (body) {
                state.planId = Number(body.id) || Number(id);
                state.planTitle = body.title || title || 'My plan';
                account.plans = Array.isArray(body.plans) ? body.plans : account.plans;
                account.lastPlanId = Number(body.lastPlanId) || state.planId;
                if ((account.generation || 0) === generation) {
                    persist({ remote: false, clean: true });
                }
                accountStatus('Saved');
                if (!automatic) {
                    setStatus('Saved. This plan will be here when you come back.');
                }
                renderAccount();
            }).catch(function (error) {
                state.dirty = true;
                persist({ remote: false });
                accountStatus('Not saved', 'alert');
                if (!automatic) {
                    setStatus(error.message);
                }
            }).then(function () {
                account.busy = false;
                renderAccount();
            });
        }

        function loadPlan(id, quiet) {
            accountStatus('Opening…');
            return accountRequest('plans/' + id, { method: 'GET' }).then(function (body) {
                var data = body.plan || {};
                state = sanitize(data);
                state.planId = Number(body.id) || Number(id);
                state.planTitle = body.title || '';
                state.selected = null;
                state.group = [];
                state.tool = 'select';
                state.dirty = false;
                adoptIds();
                account.lastPlanId = state.planId;
                if (Array.isArray(body.plans)) {
                    account.plans = body.plans;
                }
                persist({ remote: false, clean: true, history: !quiet });
                if (quiet) {
                    noteHistory();
                }
                syncDoorTool();
                syncSizeInputs();
                syncShapeButtons();
                renderPalette();
                renderPlan();
                renderSelection();
                renderLevels();
                accountStatus(quiet ? '' : 'Opened');
                setStatus(quiet ? '' : 'Opened ' + state.planTitle + '.');
                renderAccount();
            }).catch(function (error) {
                accountStatus('');
                setStatus(error.message);
                renderAccount();
            });
        }

        function deletePlan(id, title) {
            if (!window.confirm('Delete "' + title + '"?')) {
                return;
            }
            accountRequest('plans/' + id, { method: 'DELETE' }).then(function (body) {
                account.plans = Array.isArray(body.plans) ? body.plans : [];
                account.lastPlanId = Number(body.lastPlanId) || 0;
                if (Number(state.planId) === Number(id)) {
                    window.clearTimeout(account.timer);
                    state.planId = 0;
                    state.planTitle = '';
                    state.dirty = false;
                    persist({ remote: false, clean: true });
                    accountStatus('');
                    setStatus('Removed from your account. Save again if you want to keep what is on screen.');
                }
                renderAccount();
                openModal('rooms');
            }).catch(function (error) {
                setFormError(error.message);
            });
        }

        function logOut() {
            accountRequest('logout', { method: 'POST', body: '{}' }).then(function (body) {
                window.clearTimeout(account.timer);
                applySession(body);
                accountStatus('');
                setStatus('Signed out. Log in again when you want this plan saved to your account.');
            }).catch(function (error) {
                setStatus(error.message);
            });
        }

        function accountStatus(message, kind) {
            account.statusText = message || '';
            account.statusKind = kind || '';
            window.clearTimeout(account.statusTimer);
            if (message === 'Saved' || message === 'Opened') {
                account.statusTimer = window.setTimeout(function () {
                    account.statusText = '';
                    account.statusKind = '';
                    paintAccountStatus();
                }, 2500);
            }
            paintAccountStatus();
        }

        function paintAccountStatus() {
            var text = account.statusText;
            if (!text && account.user && state.planTitle) {
                text = state.planTitle;
            }
            if (!accountStatusEl) {
                return;
            }
            accountStatusEl.textContent = text || '';
            accountStatusEl.hidden = !text;
            accountStatusEl.classList.toggle('is-alert', account.statusKind === 'alert');
        }

        function renderAccount() {
            var loggedIn = !!account.user;
            if (!saveButton) {
                return;
            }
            loginButton.hidden = loggedIn;
            roomsButton.hidden = !loggedIn;
            logoutButton.hidden = !loggedIn;
            saveButton.disabled = !!account.busy;
            saveButton.textContent = loggedIn ? 'Save' : 'Save plan';
            if (loggedIn && account.user.name) {
                accountNameEl.hidden = false;
                accountNameEl.textContent = 'Hi, ' + account.user.name;
            } else {
                accountNameEl.hidden = true;
                accountNameEl.textContent = '';
            }
            paintAccountStatus();
        }

        function onSaveClick() {
            if (!account.restUrl) {
                setStatus('Saving is unavailable on this page.');
                return;
            }
            if (!account.user) {
                account.mode = 'register';
                openModal('auth');
                return;
            }
            if (!state.planId) {
                account.saveAsNew = false;
                openModal('name');
                return;
            }
            updatePlan(state.planId, state.planTitle, false);
        }

        function buildAccount(toolbar) {
            var bar = document.createElement('div');
            bar.className = 'room-builder__account';
            accountNameEl = document.createElement('span');
            accountNameEl.className = 'room-builder__account-name';
            accountStatusEl = document.createElement('span');
            accountStatusEl.className = 'room-builder__account-status';
            accountStatusEl.setAttribute('aria-live', 'polite');
            saveButton = makeButton('Save plan', 'room-builder__button room-builder__button--primary');
            saveButton.addEventListener('click', onSaveClick);
            loginButton = makeButton('Log in', 'room-builder__button');
            loginButton.addEventListener('click', function () {
                if (!account.restUrl) {
                    setStatus('Saving is unavailable on this page.');
                    return;
                }
                account.mode = 'login';
                openModal('auth');
            });
            roomsButton = makeButton('My Plans', 'room-builder__button');
            roomsButton.addEventListener('click', function () {
                openModal('rooms');
            });
            logoutButton = makeButton('Log out', 'room-builder__button');
            logoutButton.addEventListener('click', logOut);
            bar.appendChild(accountNameEl);
            bar.appendChild(accountStatusEl);
            bar.appendChild(saveButton);
            bar.appendChild(loginButton);
            bar.appendChild(roomsButton);
            bar.appendChild(logoutButton);
            toolbar.appendChild(bar);

            modal = document.createElement('div');
            modal.className = 'room-builder__modal';
            modal.hidden = true;
            dialog = document.createElement('div');
            dialog.className = 'room-builder__dialog';
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-modal', 'true');
            modal.appendChild(dialog);
            modal.addEventListener('click', function (event) {
                if (event.target === modal) {
                    closeModal();
                }
            });
            root.appendChild(modal);
            renderAccount();
        }

        function openModal(kind) {
            dialog.innerHTML = '';
            formErrorEl = null;
            modal.hidden = false;
            dialog.classList.toggle('room-builder__dialog--sheet', kind === 'sheet');
            if (kind === 'rooms') {
                fillRooms();
            } else if (kind === 'name') {
                fillName();
            } else if (kind === 'sheet') {
                fillSheet();
            } else {
                fillAuth();
            }
            window.setTimeout(function () {
                var field = dialog.querySelector('input');
                if (field) {
                    field.focus();
                }
            }, 0);
        }

        function closeModal() {
            modal.hidden = true;
            dialog.innerHTML = '';
            formErrorEl = null;
        }

        function setFormError(message) {
            if (!formErrorEl) {
                return;
            }
            formErrorEl.hidden = !message;
            formErrorEl.textContent = message || '';
        }

        function dialogHeading(text) {
            var heading = document.createElement('h3');
            heading.id = 'room-builder-dialog-title';
            heading.textContent = text;
            dialog.setAttribute('aria-labelledby', heading.id);
            return heading;
        }

        function dialogCopy(text) {
            var copy = document.createElement('p');
            copy.textContent = text;
            return copy;
        }

        function formField(labelText, type, name, autocomplete) {
            var label = document.createElement('label');
            var input = document.createElement('input');
            label.className = 'room-builder__dialog-field';
            label.appendChild(document.createTextNode(labelText));
            input.type = type;
            input.name = name;
            input.autocomplete = autocomplete;
            label.appendChild(input);
            return label;
        }

        function dialogActions() {
            var actions = document.createElement('div');
            actions.className = 'room-builder__dialog-actions';
            return actions;
        }

        function fillAuth() {
            var form = document.createElement('form');
            var switcher = document.createElement('div');
            var actions = dialogActions();
            var submit = makeButton(account.mode === 'login' ? 'Log in' : 'Create account', 'room-builder__button room-builder__button--primary');
            var cancel = makeButton('Cancel', 'room-builder__button');
            switcher.className = 'room-builder__auth-switch';
            switcher.appendChild(authModeButton('Create account', 'register'));
            switcher.appendChild(authModeButton('Log in', 'login'));
            formErrorEl = document.createElement('p');
            formErrorEl.className = 'room-builder__form-error';
            formErrorEl.hidden = true;
            dialog.appendChild(dialogHeading(account.mode === 'login' ? 'Welcome back' : 'Save your plan'));
            dialog.appendChild(dialogCopy(account.mode === 'login'
                ? 'Log in and your saved plans open again on this site.'
                : 'Create an account and this plan stays with you. Next time you visit, it opens right where you left it.'));
            dialog.appendChild(switcher);
            form.appendChild(formErrorEl);
            if (account.mode === 'login') {
                form.appendChild(formField('Email or username', 'text', 'login', 'username'));
                form.appendChild(formField('Password', 'password', 'password', 'current-password'));
            } else {
                form.appendChild(formField('Name', 'text', 'name', 'name'));
                form.appendChild(formField('Email', 'email', 'email', 'email'));
                form.appendChild(formField('Password', 'password', 'password', 'new-password'));
            }
            if (!planIsBlank()) {
                form.appendChild(formField('Plan name', 'text', 'title', 'off'));
                form.querySelector('[name="title"]').value = 'My plan';
            }
            submit.type = 'submit';
            cancel.addEventListener('click', closeModal);
            actions.appendChild(submit);
            actions.appendChild(cancel);
            form.appendChild(actions);
            form.addEventListener('submit', submitAuth);
            dialog.appendChild(form);
        }

        function authModeButton(label, mode) {
            var button = makeButton(label, 'room-builder__button');
            button.classList.toggle('is-active', account.mode === mode);
            button.addEventListener('click', function () {
                account.mode = mode;
                openModal('auth');
            });
            return button;
        }

        function submitAuth(event) {
            var form = event.target;
            var payload;
            var path;
            event.preventDefault();
            payload = {
                name: fieldValue(form, 'name'),
                email: fieldValue(form, 'email'),
                login: fieldValue(form, 'login'),
                password: form.password ? form.password.value : '',
                title: fieldValue(form, 'title')
            };
            if (account.mode === 'register') {
                if (!payload.name) {
                    setFormError('Enter your name.');
                    return;
                }
                if (payload.email.indexOf('@') < 1) {
                    setFormError('Enter a valid email.');
                    return;
                }
                if (payload.password.length < 8) {
                    setFormError('Use at least 8 characters for the password.');
                    return;
                }
                path = 'register';
            } else {
                if (!payload.login || !payload.password) {
                    setFormError('Enter your email and password.');
                    return;
                }
                path = 'login';
            }
            setFormError('');
            accountRequest(path, {
                method: 'POST',
                body: JSON.stringify(payload)
            }).then(function (body) {
                var title = payload.title || 'My plan';
                applySession(body);
                closeModal();
                if (!planIsBlank()) {
                    return createPlan(title);
                }
                if (account.lastPlanId && ownsPlan(account.lastPlanId)) {
                    return loadPlan(account.lastPlanId, true);
                }
                setStatus('Signed in. Save a plan whenever you are ready.');
            }).catch(function (error) {
                if (modal.hidden) {
                    setStatus(error.message);
                    return;
                }
                setFormError(error.message);
            });
        }

        function fieldValue(form, name) {
            var field = form.elements[name];
            return field ? String(field.value || '').trim() : '';
        }

        function fillName() {
            var form = document.createElement('form');
            var actions = dialogActions();
            var inputWrap = formField('Plan name', 'text', 'title', 'off');
            var submit = makeButton('Save', 'room-builder__button room-builder__button--primary');
            var cancel = makeButton('Cancel', 'room-builder__button');
            formErrorEl = document.createElement('p');
            formErrorEl.className = 'room-builder__form-error';
            formErrorEl.hidden = true;
            dialog.appendChild(dialogHeading(account.saveAsNew ? 'Save as a new plan' : 'Name this plan'));
            dialog.appendChild(dialogCopy('Give it a name so you can find it later.'));
            dialog.appendChild(formErrorEl);
            inputWrap.querySelector('input').value = account.saveAsNew ? '' : (state.planTitle || 'My plan');
            inputWrap.querySelector('input').maxLength = 80;
            form.appendChild(inputWrap);
            submit.type = 'submit';
            cancel.addEventListener('click', closeModal);
            actions.appendChild(submit);
            actions.appendChild(cancel);
            form.appendChild(actions);
            form.addEventListener('submit', function (event) {
                var title = fieldValue(form, 'title') || 'My plan';
                event.preventDefault();
                closeModal();
                if (account.saveAsNew || !state.planId) {
                    createPlan(title);
                    return;
                }
                state.planTitle = title;
                updatePlan(state.planId, title, false);
            });
            dialog.appendChild(form);
        }

        function fillRooms() {
            var list = document.createElement('div');
            var actions = dialogActions();
            var saveNew = makeButton('Save as a new plan', 'room-builder__button room-builder__button--primary');
            var close = makeButton('Close', 'room-builder__button');
            formErrorEl = document.createElement('p');
            formErrorEl.className = 'room-builder__form-error';
            formErrorEl.hidden = true;
            list.className = 'room-builder__rooms';
            dialog.appendChild(dialogHeading('My Plans'));
            dialog.appendChild(dialogCopy('Open a plan you saved earlier, or keep this one as a new copy.'));
            dialog.appendChild(formErrorEl);
            if (!account.plans.length) {
                list.appendChild(dialogCopy('You have no saved plans yet.'));
            }
            account.plans.forEach(function (plan) {
                list.appendChild(roomRow(plan));
            });
            saveNew.addEventListener('click', function () {
                account.saveAsNew = true;
                openModal('name');
            });
            close.addEventListener('click', closeModal);
            actions.appendChild(saveNew);
            actions.appendChild(close);
            dialog.appendChild(list);
            dialog.appendChild(actions);
        }

        function roomRow(plan) {
            var row = document.createElement('div');
            var copy = document.createElement('div');
            var title = document.createElement('div');
            var when = document.createElement('div');
            var open = makeButton(Number(plan.id) === Number(state.planId) ? 'On screen' : 'Open', 'room-builder__button');
            var remove = makeButton('Delete', 'room-builder__button room-builder__button--danger');
            row.className = 'room-builder__room-row';
            if (Number(plan.id) === Number(state.planId)) {
                row.classList.add('is-current');
            }
            copy.className = 'room-builder__room-copy';
            title.className = 'room-builder__room-title';
            title.textContent = plan.title || 'My plan';
            when.className = 'room-builder__room-date';
            when.textContent = formatWhen(plan.modified);
            if (plan.preview && Number(plan.preview.levels) > 1) {
                when.textContent += ' · ' + plan.preview.levels + ' levels';
            }
            copy.appendChild(title);
            copy.appendChild(when);
            open.addEventListener('click', function () {
                closeModal();
                loadPlan(plan.id, false);
            });
            remove.addEventListener('click', function () {
                deletePlan(plan.id, plan.title || 'My plan');
            });
            row.appendChild(planThumb(plan.preview));
            row.appendChild(copy);
            row.appendChild(open);
            row.appendChild(remove);
            return row;
        }

        function previewOutline(room) {
            var width = Number(room.width) || 0;
            var depth = Number(room.depth) || 0;
            var cutW = Number(room.cutW) || 0;
            var cutD = Number(room.cutD) || 0;
            var shoulder;
            var points = room.points || [];
            if (room.kind === 'custom' && points.length >= 4) {
                return points.map(function (point) {
                    return [Number(point[0]) || 0, Number(point[1]) || 0];
                });
            }
            if (room.kind === 'l' && cutW > 0 && cutD > 0 && width > cutW) {
                return [
                    [0, 0],
                    [width - cutW, 0],
                    [width - cutW, cutD],
                    [width, cutD],
                    [width, depth],
                    [0, depth]
                ];
            }
            if (room.kind === 'l2' && cutW > 0 && cutD > 0 && width > cutW) {
                return [
                    [cutW, 0],
                    [width, 0],
                    [width, depth],
                    [0, depth],
                    [0, cutD],
                    [cutW, cutD]
                ];
            }
            if (room.kind === 't' && cutW > 0 && cutD > 0 && width > cutW) {
                shoulder = (width - cutW) / 2;
                return [
                    [0, 0],
                    [width, 0],
                    [width, cutD],
                    [shoulder + cutW, cutD],
                    [shoulder + cutW, depth],
                    [shoulder, depth],
                    [shoulder, cutD],
                    [0, cutD]
                ];
            }
            return [[0, 0], [width, 0], [width, depth], [0, depth]];
        }

        function previewFaces(room) {
            if (room && Array.isArray(room.faces) && room.faces.length) {
                return room.faces.filter(function (face) {
                    return face && face.length >= 4;
                }).map(function (face) {
                    return face.map(function (point) {
                        return [Number(point[0]) || 0, Number(point[1]) || 0];
                    });
                });
            }
            var outline = previewOutline(room || {});
            return outline.length >= 4 ? [outline] : [];
        }

        function planThumb(preview) {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var room = preview && preview.room ? preview.room : { kind: 'rect', width: 12, depth: 14 };
            var faces = previewFaces(room);
            var outline = faces.length ? faces[0] : [];
            var minX = outline.length ? outline[0][0] : 0;
            var minY = outline.length ? outline[0][1] : 0;
            var maxX = minX;
            var maxY = minY;
            var pad = 0.7;
            svg.setAttribute('class', 'room-builder__plan-thumb');
            svg.setAttribute('aria-hidden', 'true');
            faces.forEach(function (face) {
                face.forEach(function (point) {
                    minX = Math.min(minX, point[0]);
                    minY = Math.min(minY, point[1]);
                    maxX = Math.max(maxX, point[0]);
                    maxY = Math.max(maxY, point[1]);
                });
            });
            if (maxX - minX < 1) {
                maxX = minX + 12;
            }
            if (maxY - minY < 1) {
                maxY = minY + 14;
            }
            svg.setAttribute('viewBox', (minX - pad) + ' ' + (minY - pad) + ' ' + (maxX - minX + pad * 2) + ' ' + (maxY - minY + pad * 2));
            faces.forEach(function (face) {
                var floor = document.createElementNS(svg.namespaceURI, 'polygon');
                floor.setAttribute('points', face.map(function (point) {
                    return point[0] + ',' + point[1];
                }).join(' '));
                floor.setAttribute('class', 'room-builder__plan-thumb-floor');
                svg.appendChild(floor);
            });
            ((preview && preview.items) || []).forEach(function (item) {
                var piece = catalogItem(item.catalogId);
                var box;
                var mark;
                if (!piece) {
                    return;
                }
                box = footprint({
                    catalogId: item.catalogId,
                    x: Number(item.x) || 0,
                    y: Number(item.y) || 0,
                    rotation: Number(item.rotation) || 0,
                    width: item.width,
                    depth: item.depth
                });
                mark = document.createElementNS(svg.namespaceURI, 'rect');
                mark.setAttribute('x', item.x);
                mark.setAttribute('y', item.y);
                mark.setAttribute('width', box.w);
                mark.setAttribute('height', box.d);
                mark.setAttribute('class', piece.kind === 'rug' ? 'room-builder__plan-thumb-rug' : 'room-builder__plan-thumb-piece');
                svg.appendChild(mark);
            });
            ((preview && preview.stairs) || []).forEach(function (stair) {
                var box = stairBox({ x: stair.x, y: stair.y, rotation: Number(stair.rotation) || 0 });
                var mark = document.createElementNS(svg.namespaceURI, 'rect');
                mark.setAttribute('x', stair.x);
                mark.setAttribute('y', stair.y);
                mark.setAttribute('width', box.w);
                mark.setAttribute('height', box.d);
                mark.setAttribute('class', 'room-builder__plan-thumb-stair');
                svg.appendChild(mark);
            });
            return svg;
        }

        function formatWhen(iso) {
            var date = new Date(iso);
            if (isNaN(date.getTime())) {
                return '';
            }
            return date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        function showLevel(level, animate) {
            state.activeLevelId = level.id;
            state.room = cloneData(level.room);
            state.openings = cloneData(level.openings);
            state.items = cloneData(level.items);
            state.stairs = cloneData(level.stairs || []);
            state.catalog = level.catalog || 'living';
            state.selected = null;
            state.group = [];
            state.tool = 'select';
            adoptIds();
            syncDoorTool();
            syncSizeInputs();
            syncShapeButtons();
            persist();
            renderPalette();
            renderPlan();
            renderSelection();
            renderLevels();
            setStatus('');
            if (animate) {
                playLevelArrival();
            }
        }

        function playLevelArrival() {
            if (!stage) {
                return;
            }
            stage.classList.remove('is-arriving');
            void stage.offsetWidth;
            stage.classList.add('is-arriving');
            window.setTimeout(function () {
                stage.classList.remove('is-arriving');
            }, 1000);
        }

        function switchLevel(id) {
            var level;
            if (!id || id === state.activeLevelId) {
                return;
            }
            level = findLevel(id);
            if (!level) {
                return;
            }
            commitActiveLevel();
            showLevel(level, true);
        }

        function firstFloorStairs() {
            commitActiveLevel();
            var level = findLevel('first');
            return level && Array.isArray(level.stairs) ? level.stairs : [];
        }

        function stairGoesDown(stair) {
            return !!(stair && stair.direction === 'down');
        }

        function firstFloorUpStairs() {
            return firstFloorStairs().filter(function (stair) {
                return !stairGoesDown(stair);
            });
        }

        function firstFloorDownStairs() {
            return firstFloorStairs().filter(stairGoesDown);
        }

        function firstFloorCellar() {
            commitActiveLevel();
            var level = findLevel('first');
            var items = level && Array.isArray(level.items) ? level.items : [];
            return items.filter(function (item) {
                return item.catalogId === 'cellar-access';
            });
        }

        function basementReady() {
            return firstFloorDownStairs().length > 0 || firstFloorCellar().length > 0;
        }

        function shapePolygon(room) {
            var width = Number(room && room.width) || 0;
            var depth = Number(room && room.depth) || 0;
            var cutW = Number(room && room.cutW) || 0;
            var cutD = Number(room && room.cutD) || 0;
            var shoulder;
            if (!room) {
                return [];
            }
            if (room.kind === 'custom') {
                return (room.points || []).map(function (point) {
                    return [point[0], point[1]];
                });
            }
            if (room.kind === 'l') {
                return [
                    [0, 0],
                    [width - cutW, 0],
                    [width - cutW, cutD],
                    [width, cutD],
                    [width, depth],
                    [0, depth]
                ];
            }
            if (room.kind === 'l2') {
                return [
                    [cutW, 0],
                    [width, 0],
                    [width, depth],
                    [0, depth],
                    [0, cutD],
                    [cutW, cutD]
                ];
            }
            if (room.kind === 't') {
                shoulder = (width - cutW) / 2;
                return [
                    [0, 0],
                    [width, 0],
                    [width, cutD],
                    [shoulder + cutW, cutD],
                    [shoulder + cutW, depth],
                    [shoulder, depth],
                    [shoulder, cutD],
                    [0, cutD]
                ];
            }
            return [[0, 0], [width, 0], [width, depth], [0, depth]];
        }

        function roomOrigin(room) {
            return {
                x: room && isFinite(Number(room.originX)) ? Number(room.originX) : 0,
                y: room && isFinite(Number(room.originY)) ? Number(room.originY) : 0
            };
        }

        function roomFaces(room) {
            var poly;
            if (room && Array.isArray(room.faces) && room.faces.length) {
                return room.faces.filter(function (face) {
                    return face && face.length >= 4;
                }).map(function (face) {
                    return face.map(function (point) {
                        return [point[0], point[1]];
                    });
                });
            }
            poly = shapePolygon(room);
            return poly.length >= 4 ? [poly] : [];
        }

        function stairFitsRoom(stair, room) {
            var box = stairBox(stair);
            return roomFaces(room).some(function (face) {
                return rectInPolygon(stair.x, stair.y, box.w, box.d, face);
            });
        }

        function nodeSegments(list) {
            var segments = cloneSegments(list);
            var guard = 0;
            function findJunction() {
                var hostIndex;
                var otherIndex;
                var host;
                var other;
                var points;
                var pointIndex;
                var along;
                var length;
                for (hostIndex = 0; hostIndex < segments.length; hostIndex += 1) {
                    host = segments[hostIndex];
                    length = arcLengthOf(segmentSpan(host), host.bulge || 0);
                    for (otherIndex = 0; otherIndex < segments.length; otherIndex += 1) {
                        if (otherIndex === hostIndex) {
                            continue;
                        }
                        other = segments[otherIndex];
                        points = [[other.x1, other.y1], [other.x2, other.y2]];
                        for (pointIndex = 0; pointIndex < points.length; pointIndex += 1) {
                            if (!pointOnSegment(points[pointIndex][0], points[pointIndex][1], host)) {
                                continue;
                            }
                            along = arcDistanceTo(host, points[pointIndex][0], points[pointIndex][1]);
                            if (along < MIN_WALL - 0.001 || length - along < MIN_WALL - 0.001) {
                                continue;
                            }
                            return {
                                host: host,
                                x: points[pointIndex][0],
                                y: points[pointIndex][1]
                            };
                        }
                    }
                }
                return null;
            }
            segments.forEach(orderSegment);
            while (guard < 48) {
                var junction = findJunction();
                var first;
                var second;
                var index;
                guard += 1;
                if (!junction) {
                    break;
                }
                first = {
                    id: junction.host.id,
                    x1: junction.host.x1,
                    y1: junction.host.y1,
                    x2: junction.x,
                    y2: junction.y
                };
                second = {
                    id: uid('w'),
                    x1: junction.x,
                    y1: junction.y,
                    x2: junction.host.x2,
                    y2: junction.host.y2
                };
                orderSegment(first);
                orderSegment(second);
                first.bulge = sagittaBetween(junction.host, first.x1, first.y1, first.x2, first.y2);
                second.bulge = sagittaBetween(junction.host, second.x1, second.y1, second.x2, second.y2);
                if (!first.bulge) {
                    delete first.bulge;
                }
                if (!second.bulge) {
                    delete second.bulge;
                }
                index = segments.indexOf(junction.host);
                segments.splice(index, 1, first, second);
            }
            return segments;
        }

        function traceFaces(list) {
            var nodes = {};
            var used = {};
            var faces = [];
            function ensureNode(x, y) {
                var key = pointKey(x, y);
                if (!nodes[key]) {
                    nodes[key] = { x: snap(x), y: snap(y), outs: [] };
                }
                return key;
            }
            function dirKey(from, to, id) {
                return id + '|' + from + '|' + to;
            }
            (list || []).forEach(function (segment) {
                var start;
                var end;
                orderSegment(segment);
                if (pointKey(segment.x1, segment.y1) === pointKey(segment.x2, segment.y2)) {
                    return;
                }
                start = ensureNode(segment.x1, segment.y1);
                end = ensureNode(segment.x2, segment.y2);
                nodes[start].outs.push({
                    id: segment.id,
                    to: end,
                    angle: Math.atan2(nodes[end].y - nodes[start].y, nodes[end].x - nodes[start].x)
                });
                nodes[end].outs.push({
                    id: segment.id,
                    to: start,
                    angle: Math.atan2(nodes[start].y - nodes[end].y, nodes[start].x - nodes[end].x)
                });
            });
            Object.keys(nodes).forEach(function (key) {
                nodes[key].outs.sort(function (a, b) {
                    return a.angle - b.angle;
                });
            });
            function nextHalf(atKey, cameFromKey) {
                var outs = nodes[atKey].outs;
                var index;
                for (index = 0; index < outs.length; index += 1) {
                    if (outs[index].to === cameFromKey) {
                        return outs[(index - 1 + outs.length) % outs.length];
                    }
                }
                return null;
            }
            function walk(startFrom, startTo, startId) {
                var points = [[nodes[startFrom].x, nodes[startFrom].y]];
                var edgeIds = [];
                var from = startFrom;
                var to = startTo;
                var id = startId;
                var guard = 0;
                var next;
                while (guard < 80) {
                    guard += 1;
                    if (used[dirKey(from, to, id)]) {
                        return null;
                    }
                    used[dirKey(from, to, id)] = true;
                    points.push([nodes[to].x, nodes[to].y]);
                    edgeIds.push(id);
                    if (to === startFrom && points.length > 3) {
                        points.pop();
                        return { points: points, edgeIds: edgeIds };
                    }
                    next = nextHalf(to, from);
                    if (!next) {
                        return null;
                    }
                    from = to;
                    to = next.to;
                    id = next.id;
                }
                return null;
            }
            (list || []).forEach(function (segment) {
                var start = pointKey(segment.x1, segment.y1);
                var end = pointKey(segment.x2, segment.y2);
                var forward;
                var backward;
                if (!nodes[start] || !nodes[end]) {
                    return;
                }
                forward = walk(start, end, segment.id);
                backward = walk(end, start, segment.id);
                [forward, backward].forEach(function (face) {
                    if (face && face.points.length >= 4 && signedArea(face.points) > 1) {
                        faces.push(face);
                    }
                });
            });
            return faces;
        }

        function dropStraightPoints(points, edgeIds) {
            var nextPoints = points.map(function (point) {
                return [point[0], point[1]];
            });
            var nextIds = edgeIds.slice();
            var guard = 0;
            var index;
            var count;
            var start;
            var middle;
            var end;
            var along;
            var across;
            while (guard < 24) {
                guard += 1;
                count = nextPoints.length;
                if (count < 4) {
                    break;
                }
                for (index = 0; index < count; index += 1) {
                    start = nextPoints[index];
                    middle = nextPoints[(index + 1) % count];
                    end = nextPoints[(index + 2) % count];
                    along = [middle[0] - start[0], middle[1] - start[1]];
                    across = [end[0] - middle[0], end[1] - middle[1]];
                    if (!edgeAxis(start, middle) || edgeAxis(start, middle) !== edgeAxis(middle, end)) {
                        continue;
                    }
                    if (along[0] * across[0] + along[1] * across[1] <= 0) {
                        continue;
                    }
                    nextPoints.splice((index + 1) % count, 1);
                    nextIds.splice((index + 1) % count, 1);
                    break;
                }
                if (index === count) {
                    break;
                }
            }
            return { points: nextPoints, edgeIds: nextIds };
        }

        function stairInPoints(stair, points) {
            var box = stairBox(stair);
            return pointInPoly(stair.x + box.w / 2, stair.y + box.d / 2, points);
        }

        function roomFromFace(face, originX, originY) {
            var shifted = face.points.map(function (point) {
                return [snap(point[0] - originX), snap(point[1] - originY)];
            });
            var ids = face.edgeIds.map(function () {
                return uid('e');
            });
            var simplified = dropStraightPoints(shifted, ids);
            var placed = normalizeOrigin(simplified.points);
            var xs = {};
            var ys = {};
            var rectangular;
            placed.points.forEach(function (point) {
                xs[snap(point[0])] = true;
                ys[snap(point[1])] = true;
            });
            rectangular = placed.points.length === 4 && Object.keys(xs).length === 2 && Object.keys(ys).length === 2;
            if (rectangular) {
                return {
                    shape: placed.width === placed.depth ? 'square' : 'rectangle',
                    kind: 'rect',
                    width: placed.width,
                    depth: placed.depth,
                    cutW: 0,
                    cutD: 0,
                    originX: originX,
                    originY: originY
                };
            }
            return {
                shape: 'custom',
                kind: 'custom',
                width: placed.width,
                depth: placed.depth,
                cutW: 0,
                cutD: 0,
                originX: originX,
                originY: originY,
                points: placed.points,
                edgeIds: simplified.edgeIds,
                segments: segmentsFromPolygon(placed.points, simplified.edgeIds)
            };
        }

        function stairStory(first, direction) {
            var wantDown = direction === 'down';
            var stairs = cloneData(first.stairs || []).filter(function (stair) {
                return wantDown ? stair.direction === 'down' : stair.direction !== 'down';
            });
            var segments = first.room && first.room.segments && first.room.segments.length ? nodeSegments(first.room.segments) : [];
            var faces = segments.length ? traceFaces(segments) : [];
            var chosen = null;
            var bestCount = 0;
            if (faces.length < 2) {
                return {
                    room: cloneData(first.room),
                    stairs: stairs,
                    partial: false
                };
            }
            faces.forEach(function (face) {
                var count = stairs.filter(function (stair) {
                    return stairInPoints(stair, face.points);
                }).length;
                if (count > bestCount) {
                    bestCount = count;
                    chosen = face;
                }
            });
            if (!chosen) {
                return {
                    room: cloneData(first.room),
                    stairs: stairs,
                    partial: false
                };
            }
            var bounds = normalizeOrigin(chosen.points);
            var upstairsStairs = stairs.filter(function (stair) {
                return stairInPoints(stair, chosen.points);
            }).map(function (stair) {
                var copy = cloneData(stair);
                copy.x = snap(stair.x - bounds.minX);
                copy.y = snap(stair.y - bounds.minY);
                return copy;
            });
            if (!upstairsStairs.length) {
                return {
                    room: cloneData(first.room),
                    stairs: stairs,
                    partial: false
                };
            }
            return {
                room: roomFromFace(chosen, bounds.minX, bounds.minY),
                stairs: upstairsStairs,
                partial: true
            };
        }

        function cellarStory(first) {
            var hatches = cloneData(firstFloorCellar());
            var segments = first.room && first.room.segments && first.room.segments.length ? nodeSegments(first.room.segments) : [];
            var faces = segments.length ? traceFaces(segments) : [];
            var chosen = null;
            var bestCount = 0;
            function hatchInside(item, points) {
                var size = footprint(item);
                return pointInPoly(item.x + size.w / 2, item.y + size.d / 2, points);
            }
            if (faces.length < 2) {
                return {
                    room: cloneData(first.room),
                    items: hatches,
                    partial: false
                };
            }
            faces.forEach(function (face) {
                var count = hatches.filter(function (item) {
                    return hatchInside(item, face.points);
                }).length;
                if (count > bestCount) {
                    bestCount = count;
                    chosen = face;
                }
            });
            if (!chosen) {
                return {
                    room: cloneData(first.room),
                    items: hatches,
                    partial: false
                };
            }
            var bounds = normalizeOrigin(chosen.points);
            var copied = hatches.filter(function (item) {
                return hatchInside(item, chosen.points);
            }).map(function (item) {
                var copy = cloneData(item);
                copy.x = snap(item.x - bounds.minX);
                copy.y = snap(item.y - bounds.minY);
                return copy;
            });
            if (!copied.length) {
                return {
                    room: cloneData(first.room),
                    items: hatches,
                    partial: false
                };
            }
            return {
                room: roomFromFace(chosen, bounds.minX, bounds.minY),
                items: copied,
                partial: true
            };
        }

        function addLevel(kind) {
            var level;
            var first;
            var upstairs;
            var below;
            var partial = false;
            var arrival = '';
            if (kind !== 'basement' && kind !== 'second') {
                return;
            }
            if (findLevel(kind)) {
                switchLevel(kind);
                return;
            }
            if (kind === 'second' && !firstFloorUpStairs().length) {
                setStatus('Add stairs on the first floor before adding a second story.');
                return;
            }
            if (kind === 'basement' && !basementReady()) {
                setStatus('Add stairs down, or a cellar access, before adding a basement.');
                return;
            }
            commitActiveLevel();
            level = blankLevel(kind);
            if (kind === 'second') {
                first = findLevel('first');
                upstairs = stairStory(first, 'up');
                level.room = upstairs.room;
                level.stairs = upstairs.stairs;
                partial = upstairs.partial;
                arrival = partial ? 'Second story added from the room the stairs are in.' : '';
            }
            if (kind === 'basement') {
                first = findLevel('first');
                if (firstFloorDownStairs().length) {
                    below = stairStory(first, 'down');
                    level.room = below.room;
                    level.stairs = below.stairs;
                    partial = below.partial;
                    arrival = partial ? 'Basement added from the room the stairs lead down from.' : 'Basement added. The stairs down lead into it.';
                } else {
                    below = cellarStory(first);
                    level.room = below.room;
                    level.items = below.items;
                    partial = below.partial;
                    arrival = partial ? 'Basement added from the room with the cellar access.' : 'Basement added from the cellar access.';
                }
            }
            state.levels.push(level);
            sortLevels();
            showLevel(level, true);
            if (arrival) {
                setStatus(arrival);
            }
        }

        function removeLevel(kind) {
            var level = findLevel(kind);
            var first;
            if (kind === 'first' || !level) {
                return;
            }
            if (!window.confirm('Remove the ' + level.name.toLowerCase() + '? Its walls and furniture will be deleted.')) {
                return;
            }
            commitActiveLevel();
            state.levels = state.levels.filter(function (entry) {
                return entry.id !== kind;
            });
            if (state.activeLevelId === kind) {
                first = findLevel('first');
                showLevel(first, true);
                return;
            }
            state.selected = null;
            state.tool = 'select';
            adoptIds();
            syncDoorTool();
            persist();
            renderPlan();
            renderSelection();
            renderLevels();
            setStatus('');
        }

        function buildLevels() {
            levelBar = document.createElement('div');
            levelBar.className = 'room-builder__levels';
            levelBar.setAttribute('role', 'toolbar');
            levelBar.setAttribute('aria-label', 'Building levels');
            app.appendChild(levelBar);
        }

        function lockedLevelButton(add, message) {
            var tip = document.createElement('span');
            var note = document.createElement('span');
            add.disabled = true;
            add.title = message;
            tip.className = 'room-builder__tip';
            note.className = 'room-builder__tip-text';
            note.setAttribute('role', 'tooltip');
            note.textContent = message;
            tip.appendChild(add);
            tip.appendChild(note);
            tip.addEventListener('mouseenter', function () {
                tip.classList.add('is-open');
                setStatus(message);
            });
            tip.addEventListener('mouseleave', function () {
                tip.classList.remove('is-open');
                if (statusEl.textContent === message) {
                    setStatus('');
                }
            });
            return tip;
        }

        function renderLevels() {
            var label;
            if (!levelBar) {
                return;
            }
            levelBar.innerHTML = '';
            label = document.createElement('span');
            label.className = 'room-builder__shapes-label';
            label.textContent = 'Level';
            levelBar.appendChild(label);
            ['basement', 'first', 'second'].forEach(function (kind) {
                var level = findLevel(kind);
                var add;
                var group;
                var button;
                var remove;
                if (!level) {
                    if (kind === 'first') {
                        return;
                    }
                    add = makeButton(kind === 'basement' ? 'Add basement' : 'Add second story', 'room-builder__button');
                    if (kind === 'second' && !firstFloorUpStairs().length) {
                        levelBar.appendChild(lockedLevelButton(add, 'Add stairs on the first floor before adding a second story.'));
                        return;
                    }
                    if (kind === 'basement' && !basementReady()) {
                        levelBar.appendChild(lockedLevelButton(add, 'Add stairs down, or a cellar access, before adding a basement.'));
                        return;
                    }
                    add.addEventListener('click', function () {
                        addLevel(kind);
                    });
                    levelBar.appendChild(add);
                    return;
                }
                group = document.createElement('div');
                group.className = 'room-builder__level';
                if (level.id === state.activeLevelId) {
                    group.classList.add('is-active');
                }
                button = makeButton(level.name, 'room-builder__button');
                button.setAttribute('aria-pressed', level.id === state.activeLevelId ? 'true' : 'false');
                if (level.id === state.activeLevelId) {
                    button.classList.add('is-active');
                }
                button.addEventListener('click', function () {
                    switchLevel(level.id);
                });
                group.appendChild(button);
                if (kind !== 'first') {
                    remove = makeButton('Remove', 'room-builder__button room-builder__button--danger room-builder__level-remove');
                    remove.setAttribute('aria-label', 'Remove ' + level.name.toLowerCase());
                    remove.addEventListener('click', function () {
                        removeLevel(kind);
                    });
                    group.appendChild(remove);
                }
                levelBar.appendChild(group);
            });
        }

        function buildToolbar() {
            var shapes = document.createElement('div');
            shapes.className = 'room-builder__shapes';
            var shapeLabel = document.createElement('span');
            shapeLabel.className = 'room-builder__shapes-label';
            shapeLabel.textContent = 'Shape';
            shapeLabel.title = 'Drag a shape onto an outside wall to add a room. Click a shape to start over.';
            shapes.appendChild(shapeLabel);
            SHAPES.forEach(function (template) {
                var button = makeButton(template.label, 'room-builder__button');
                button.setAttribute('data-shape', template.id);
                button.title = template.id === 'custom'
                    ? 'Click to draw your own walls.'
                    : 'Drag onto an outside wall to add this room. Click to start over with this shape.';
                button.addEventListener('pointerdown', function (event) {
                    onShapePointerDown(event, template);
                });
                shapes.appendChild(button);
            });
            app.appendChild(shapes);

            var toolbar = document.createElement('div');
            toolbar.className = 'room-builder__toolbar';
            var title = document.createElement('h2');
            title.textContent = 'House planner';
            toolbar.appendChild(title);

            widthInput = numberField('Width');
            depthInput = numberField('Depth');
            toolbar.appendChild(widthInput.parentNode);
            toolbar.appendChild(depthInput.parentNode);
            widthInput.addEventListener('change', applyRoomFromInputs);
            depthInput.addEventListener('change', applyRoomFromInputs);
            widthInput.addEventListener('keydown', commitOnEnter);
            depthInput.addEventListener('keydown', commitOnEnter);

            undoButton = makeButton('Undo', 'room-builder__button');
            undoButton.title = 'Undo (Ctrl+Z)';
            undoButton.disabled = true;
            undoButton.addEventListener('click', undo);
            toolbar.appendChild(undoButton);

            view3dButton = makeButton('3D', 'room-builder__button');
            view3dButton.title = 'Look around this floor in 3D';
            view3dButton.addEventListener('click', function () {
                toggleView3d();
            });
            toolbar.appendChild(view3dButton);

            var printButton = makeButton('Print', 'room-builder__button');
            printButton.title = 'Print or download this plan';
            printButton.addEventListener('click', function () {
                openModal('sheet');
            });
            toolbar.appendChild(printButton);

            var resetButton = makeButton('Reset', 'room-builder__button');
            resetButton.addEventListener('click', resetPlan);
            toolbar.appendChild(resetButton);
            buildAccount(toolbar);
            app.appendChild(toolbar);
        }

        function numberField(labelText) {
            var label = document.createElement('label');
            label.className = 'room-builder__field';
            label.appendChild(document.createTextNode(labelText));
            var input = document.createElement('input');
            input.type = 'number';
            input.min = String(MIN_ROOM);
            input.max = String(MAX_ROOM);
            input.step = '0.5';
            input.inputMode = 'decimal';
            label.appendChild(input);
            label.appendChild(document.createTextNode('ft'));
            return input;
        }

        function buildWorkspace() {
            var workspace = document.createElement('div');
            workspace.className = 'room-builder__workspace';

            stage = document.createElement('div');
            stage.className = 'room-builder__stage';
            stage.tabIndex = 0;
            stage.setAttribute('aria-label', 'Floor plan');
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'room-builder__plan');
            svg.setAttribute('role', 'application');
            svg.setAttribute('aria-label', 'Top-down plan');
            stage.appendChild(svg);
            view3d = document.createElement('canvas');
            view3d.className = 'room-builder__view3d';
            view3d.setAttribute('aria-label', '3D view of this floor');
            view3d.addEventListener('pointerdown', onView3dDown);
            view3d.addEventListener('pointermove', onView3dMove);
            view3d.addEventListener('pointerup', onView3dUp);
            view3d.addEventListener('pointercancel', onView3dUp);
            view3d.addEventListener('wheel', onView3dWheel, { passive: false });
            stage.appendChild(view3d);
            workspace.appendChild(stage);

            svg.addEventListener('pointerdown', onPlanPointerDown);
            svg.addEventListener('pointermove', onPlanPointerMove);
            svg.addEventListener('pointerup', onPlanPointerUp);
            svg.addEventListener('pointercancel', onPlanPointerUp);
            stage.addEventListener('pointerdown', onStagePointerDown);
            stage.addEventListener('pointermove', onStagePointerMove);
            stage.addEventListener('pointerup', onStagePointerUp);
            stage.addEventListener('pointercancel', onStagePointerUp);
            stage.addEventListener('wheel', onPlanWheel, { passive: false });

            var side = document.createElement('aside');
            side.className = 'room-builder__side';
            hintEl = document.createElement('p');
            hintEl.className = 'room-builder__hint';
            hintEl.textContent = 'Drag a shape onto an outside wall to add a room beside the house. A door is added in the shared wall. Drag a 2 ft or 6 ft wall onto the plan to keep shaping. Scroll over the plan to zoom. Drag empty floor to slide the view. Shift-click pieces, or Shift-drag a box, to move several at once.';
            statusEl = document.createElement('p');
            statusEl.className = 'room-builder__status';
            statusEl.hidden = true;
            selectionEl = document.createElement('div');
            selectionEl.className = 'room-builder__selection';

            findInput = document.createElement('input');
            findInput.className = 'room-builder__find-input';
            findInput.type = 'search';
            findInput.placeholder = 'Sofa, curved sofa, rug 8×10…';
            findInput.setAttribute('aria-label', 'Find a piece');
            findInput.addEventListener('input', function () {
                paletteQuery = findInput.value;
                renderPalette();
            });
            var findWrap = document.createElement('label');
            findWrap.className = 'room-builder__find';
            findWrap.appendChild(findInput);
            var credit = document.createElement('p');
            credit.className = 'room-builder__find-note';
            credit.appendChild(document.createTextNode('Library sizes are the '));
            var creditLink = document.createElement('a');
            creditLink.href = 'https://www.sweethome3d.com/license/';
            creditLink.target = '_blank';
            creditLink.rel = 'noopener noreferrer';
            creditLink.textContent = 'Sweet Home 3D';
            credit.appendChild(creditLink);
            credit.appendChild(document.createTextNode(' default models by Emmanuel Puybaret / eTeks and Space Mushrooms, under the GNU GPL and CC-BY.'));

            paletteEl = document.createElement('div');
            paletteEl.className = 'room-builder__palette';
            paletteEl.setAttribute('role', 'tabpanel');

            side.appendChild(wallTray());
            side.appendChild(hintEl);
            side.appendChild(statusEl);
            side.appendChild(selectionEl);
            side.appendChild(findWrap);
            side.appendChild(credit);
            side.appendChild(paletteEl);
            workspace.appendChild(side);
            app.appendChild(workspace);
        }

        function renderPalette() {
            var search = parseSearch(paletteQuery);
            var matches = [];
            paletteEl.innerHTML = '';
            paletteEl.setAttribute('aria-label', 'Pieces');
            if (!search.text && !search.size) {
                var prompt = document.createElement('p');
                prompt.className = 'room-builder__find-note';
                prompt.textContent = 'Type a piece, or a piece and a size, such as rug 8x10, curved sofa, or candy cane sofa.';
                paletteEl.appendChild(prompt);
                return;
            }
            allPieces().forEach(function (entry) {
                var name = entry.name.toLowerCase();
                var symbol = symbolFor(entry);
                var words = name + ' ' + symbol + ' ' + String(entry.kind || '') + ' ' + (entry.form || '') + ' ' + String(entry.tags || '');
                if (search.text && words.indexOf(search.text) === -1) {
                    return;
                }
                matches.push(entry);
            });
            matches.sort(function (a, b) {
                var aStart = search.text && a.name.toLowerCase().indexOf(search.text) === 0 ? 0 : 1;
                var bStart = search.text && b.name.toLowerCase().indexOf(search.text) === 0 ? 0 : 1;
                return aStart - bStart;
            });
            if (!matches.length) {
                var empty = document.createElement('p');
                empty.className = 'room-builder__find-note';
                empty.textContent = 'Nothing matches that. Try sofa, curved sofa, candy cane, or rug 8x10.';
                paletteEl.appendChild(empty);
                return;
            }
            matches.slice(0, 40).forEach(function (entry) {
                var limits = sizeLimits(entry);
                var width = entry.width;
                var depth = entry.depth;
                var button = document.createElement('button');
                var swatch;
                var copy;
                var name;
                var size;
                if (search.size) {
                    width = snap(Math.min(limits.maxW, Math.max(limits.minW, search.size.width)));
                    depth = snap(Math.min(limits.maxD, Math.max(limits.minD, search.size.depth)));
                }
                button.type = 'button';
                button.className = 'room-builder__piece';
                button.setAttribute('data-catalog', entry.id);
                button.setAttribute('data-width', String(width));
                button.setAttribute('data-depth', String(depth));
                button.addEventListener('dragstart', function (startEvent) {
                    startEvent.preventDefault();
                });
                swatch = document.createElement('span');
                swatch.className = 'room-builder__swatch';
                swatch.innerHTML = '<svg viewBox="0 0 ' + width + ' ' + depth + '" preserveAspectRatio="xMidYMid meet">' + pieceArt(entry, false) + '</svg>';
                button.appendChild(swatch);
                copy = document.createElement('span');
                copy.className = 'room-builder__piece-copy';
                name = document.createElement('span');
                name.className = 'room-builder__piece-name';
                name.textContent = entry.name;
                size = document.createElement('span');
                size.className = 'room-builder__piece-size';
                size.textContent = formatFeet(width) + ' × ' + formatFeet(depth) + ' ft' + (entry.height ? ', ' + entry.height + ' ft high' : '');
                copy.appendChild(name);
                copy.appendChild(size);
                button.appendChild(copy);
                button.addEventListener('pointerdown', onPalettePointerDown);
                paletteEl.appendChild(button);
            });
        }

        function wallTray() {
            var tray = document.createElement('div');
            var heading = document.createElement('div');
            var label = document.createElement('p');
            var row = document.createElement('div');
            tray.className = 'room-builder__wall-tray';
            heading.className = 'room-builder__wall-heading';
            label.className = 'room-builder__shapes-label';
            label.textContent = 'Walls';
            doorButton = makeButton('Add door', 'room-builder__button');
            doorButton.setAttribute('aria-pressed', 'false');
            doorButton.addEventListener('click', function () {
                chooseOpeningTool('door');
            });
            doorwayButton = makeButton('Add doorway', 'room-builder__button');
            doorwayButton.setAttribute('aria-pressed', 'false');
            doorwayButton.addEventListener('click', function () {
                chooseOpeningTool('doorway');
            });
            windowButton = makeButton('Add window', 'room-builder__button');
            windowButton.setAttribute('aria-pressed', 'false');
            windowButton.addEventListener('click', function () {
                chooseOpeningTool('window');
            });
            stairButton = makeButton('Stairs up', 'room-builder__button');
            stairButton.setAttribute('aria-pressed', 'false');
            stairButton.addEventListener('click', function () {
                state.tool = state.tool === 'stair' ? 'select' : 'stair';
                syncDoorTool();
                setStatus(state.tool === 'stair' ? 'Click inside the room to place stairs going up.' : '');
            });
            stairDownButton = makeButton('Stairs down', 'room-builder__button');
            stairDownButton.setAttribute('aria-pressed', 'false');
            stairDownButton.addEventListener('click', function () {
                state.tool = state.tool === 'stair-down' ? 'select' : 'stair-down';
                syncDoorTool();
                setStatus(state.tool === 'stair-down' ? 'Click inside the room to place stairs going down.' : '');
            });
            var openingTools = document.createElement('div');
            openingTools.className = 'room-builder__opening-tools';
            openingTools.appendChild(doorButton);
            openingTools.appendChild(doorwayButton);
            openingTools.appendChild(windowButton);
            openingTools.appendChild(stairButton);
            openingTools.appendChild(stairDownButton);
            heading.appendChild(label);
            heading.appendChild(openingTools);
            row.className = 'room-builder__wall-pieces';
            WALL_PIECES.forEach(function (length) {
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'room-builder__piece room-builder__wall-piece';
                button.setAttribute('data-wall-length', String(length));
                button.textContent = length + ' ft wall';
                button.addEventListener('dragstart', function (startEvent) {
                    startEvent.preventDefault();
                });
                button.addEventListener('pointerdown', onWallPointerDown);
                row.appendChild(button);
            });
            customWallButton = makeButton('Custom length wall', 'room-builder__button room-builder__wall-piece room-builder__wall-piece--custom');
            customWallButton.setAttribute('aria-pressed', 'false');
            customWallButton.title = 'Drag across the plan to draw a wall. Click to keep the wall tool on.';
            customWallButton.addEventListener('pointerdown', onCustomWallPointerDown);
            row.appendChild(customWallButton);
            wallNote = document.createElement('p');
            wallNote.className = 'room-builder__wall-note';
            wallNote.textContent = 'Drag across the plan. Walls turn in 45° steps.';
            wallNote.hidden = true;
            tray.appendChild(heading);
            tray.appendChild(row);
            tray.appendChild(wallNote);
            return tray;
        }

        function makeButton(label, className) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = className;
            button.textContent = label;
            button.addEventListener('dragstart', function (startEvent) {
                startEvent.preventDefault();
            });
            return button;
        }

        function commitOnEnter(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyRoomFromInputs();
            }
        }

        function applyRoomFromInputs() {
            var width = parseFloat(widthInput.value);
            var depth = parseFloat(depthInput.value);
            if (!isFinite(width) || !isFinite(depth)) {
                syncSizeInputs();
                return;
            }
            setRoomSize(width, depth);
        }

        function ensureCustom() {
            var plan;
            var points;
            if (state.room.kind === 'custom' && state.room.segments && state.room.segments.length) {
                return;
            }
            if (state.room.kind === 'custom' && state.room.points && state.room.points.length >= 4) {
                state.room.segments = segmentsFromPolygon(state.room.points, state.room.edgeIds || []);
                return;
            }
            plan = layout();
            points = plan.polygon.map(function (point) {
                return [point[0], point[1]];
            });
            state.room = {
                shape: 'custom',
                kind: 'custom',
                width: state.room.width,
                depth: state.room.depth,
                cutW: 0,
                cutD: 0,
                points: points,
                edgeIds: plan.walls.map(function (wall) {
                    return wall.id;
                }),
                segments: plan.walls.map(function (wall) {
                    return {
                        id: wall.id,
                        x1: wall.x1,
                        y1: wall.y1,
                        x2: wall.x2,
                        y2: wall.y2
                    };
                })
            };
        }

        function readSavedSegments(room) {
            var list = [];
            if (!room || !Array.isArray(room.segments)) {
                return list;
            }
            room.segments.forEach(function (segment) {
                var x1 = Number(segment && segment.x1);
                var y1 = Number(segment && segment.y1);
                var x2 = Number(segment && segment.x2);
                var y2 = Number(segment && segment.y2);
                if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
                    return;
                }
                list.push({
                    id: String(segment.id || uid('w')),
                    x1: snap(x1),
                    y1: snap(y1),
                    x2: snap(x2),
                    y2: snap(y2)
                });
                if (segment.bulge && Math.abs(snap(Number(segment.bulge))) >= 0.5) {
                    list[list.length - 1].bulge = snap(Number(segment.bulge));
                }
            });
            return list;
        }

        function segmentsFromPolygon(points, edgeIds) {
            var ids = edgeIds || [];
            return points.map(function (point, index) {
                var next = points[(index + 1) % points.length];
                return {
                    id: ids[index] || ('e' + index),
                    x1: point[0],
                    y1: point[1],
                    x2: next[0],
                    y2: next[1]
                };
            });
        }

        function cloneSegments(list) {
            return (list || []).map(copySegment);
        }

        function pointKey(x, y) {
            return snap(x).toFixed(2) + ',' + snap(y).toFixed(2);
        }

        function orderSegment(segment) {
            var swapX;
            var swapY;
            var horizontal = Math.abs(segment.y1 - segment.y2) <= 0.001;
            var vertical = Math.abs(segment.x1 - segment.x2) <= 0.001;
            function swapEnds() {
                swapX = segment.x1;
                swapY = segment.y1;
                segment.x1 = segment.x2;
                segment.y1 = segment.y2;
                segment.x2 = swapX;
                segment.y2 = swapY;
                if (segment.bulge) {
                    segment.bulge = -segment.bulge;
                }
            }
            if (horizontal) {
                segment.y2 = segment.y1;
                if (segment.x1 > segment.x2) {
                    swapEnds();
                }
                return;
            }
            if (vertical) {
                segment.x2 = segment.x1;
                if (segment.y1 > segment.y2) {
                    swapEnds();
                }
                return;
            }
            if (segment.x1 > segment.x2 || (Math.abs(segment.x1 - segment.x2) <= 0.001 && segment.y1 > segment.y2)) {
                swapEnds();
            }
        }

        function segmentSpan(segment) {
            return Math.hypot(segment.x2 - segment.x1, segment.y2 - segment.y1);
        }

        function leftNormal(dx, dy, len) {
            var span = len || Math.hypot(dx, dy) || 1;
            return { x: -dy / span, y: dx / span };
        }

        function arcRadius(chord, bulge) {
            var bow = Math.abs(bulge);
            if (bow < 0.001 || chord < 0.001) {
                return 0;
            }
            return (chord * chord / 4 + bow * bow) / (2 * bow);
        }

        function arcLengthOf(chord, bulge) {
            var bow = Math.abs(bulge);
            var radius;
            var theta;
            if (bow < 0.05 || chord < 0.001) {
                return chord;
            }
            radius = arcRadius(chord, bow);
            theta = 2 * Math.asin(Math.min(1, chord / (2 * radius)));
            return radius * theta;
        }

        function pointOnArc(x1, y1, x2, y2, bulge, t) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            var chord = Math.hypot(dx, dy) || 1;
            var mx = (x1 + x2) / 2;
            var my = (y1 + y2) / 2;
            var normal;
            var radius;
            var sign;
            var centerX;
            var centerY;
            var start;
            var end;
            var delta;
            var angle;
            var mid;
            var sample;
            if (!bulge || Math.abs(bulge) < 0.05) {
                return { x: x1 + dx * t, y: y1 + dy * t };
            }
            normal = leftNormal(dx, dy, chord);
            radius = arcRadius(chord, bulge);
            sign = bulge >= 0 ? 1 : -1;
            centerX = mx - normal.x * sign * (radius - Math.abs(bulge));
            centerY = my - normal.y * sign * (radius - Math.abs(bulge));
            start = Math.atan2(y1 - centerY, x1 - centerX);
            end = Math.atan2(y2 - centerY, x2 - centerX);
            delta = end - start;
            while (delta > Math.PI) {
                delta -= Math.PI * 2;
            }
            while (delta < -Math.PI) {
                delta += Math.PI * 2;
            }
            mid = start + delta * 0.5;
            sample = (Math.cos(mid) * radius + centerX - mx) * normal.x + (Math.sin(mid) * radius + centerY - my) * normal.y;
            if (sample * bulge < 0) {
                delta += delta > 0 ? -Math.PI * 2 : Math.PI * 2;
            }
            angle = start + delta * t;
            return {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            };
        }

        function parameterOf(segment, x, y) {
            var dx = segment.x2 - segment.x1;
            var dy = segment.y2 - segment.y1;
            var len2 = dx * dx + dy * dy;
            var bestT = 0;
            var best = Infinity;
            var step;
            var point;
            var dist;
            if (len2 < 0.0001) {
                return 0;
            }
            if (!segment.bulge || Math.abs(segment.bulge) < 0.05) {
                return Math.max(0, Math.min(1, ((x - segment.x1) * dx + (y - segment.y1) * dy) / len2));
            }
            for (step = 0; step <= 32; step += 1) {
                point = pointOnArc(segment.x1, segment.y1, segment.x2, segment.y2, segment.bulge, step / 32);
                dist = Math.hypot(point.x - x, point.y - y);
                if (dist < best) {
                    best = dist;
                    bestT = step / 32;
                }
            }
            return bestT;
        }

        function pointAlongWall(wall, distance) {
            var chord = Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) || 1;
            var length = wall.length || arcLengthOf(chord, wall.bulge || 0) || chord;
            var t = length ? distance / length : 0;
            t = Math.max(0, Math.min(1, t));
            return pointOnArc(wall.x1, wall.y1, wall.x2, wall.y2, wall.bulge || 0, t);
        }

        function arcDistanceTo(segment, x, y) {
            return parameterOf(segment, x, y) * arcLengthOf(segmentSpan(segment), segment.bulge || 0);
        }

        function segmentDirectionOk(segment) {
            var dx = segment.x2 - segment.x1;
            var dy = segment.y2 - segment.y1;
            if (Math.abs(dx) <= 0.05 || Math.abs(dy) <= 0.05) {
                return true;
            }
            return Math.abs(Math.abs(dx) - Math.abs(dy)) <= 0.08;
        }

        function endAtAngle(px, py, angle, length) {
            var snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
            var oct = ((Math.round(snapped / (Math.PI / 4)) % 8) + 8) % 8;
            var span = Math.max(MIN_WALL, length);
            var component;
            var sx;
            var sy;
            if (oct % 2 === 0) {
                return {
                    x: snap(px + Math.round(Math.cos(snapped)) * snap(span)),
                    y: snap(py + Math.round(Math.sin(snapped)) * snap(span))
                };
            }
            component = Math.max(1, snap(span / Math.SQRT2));
            sx = Math.cos(snapped) >= 0 ? 1 : -1;
            sy = Math.sin(snapped) >= 0 ? 1 : -1;
            return {
                x: snap(px + sx * component),
                y: snap(py + sy * component)
            };
        }

        var CORNER_RAYS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

        function angleRay(angle) {
            var snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
            var oct = ((Math.round(snapped / (Math.PI / 4)) % 8) + 8) % 8;
            if (oct % 2 === 0) {
                return [Math.round(Math.cos(snapped)), Math.round(Math.sin(snapped))];
            }
            return [Math.cos(snapped) >= 0 ? 1 : -1, Math.sin(snapped) >= 0 ? 1 : -1];
        }

        function rayPoint(ax, ay, adx, ady, bx, by, bdx, bdy) {
            var det = adx * bdy - ady * bdx;
            var t;
            var u;
            var x;
            var y;
            if (Math.abs(det) < 0.001) {
                return null;
            }
            t = ((bx - ax) * bdy - (by - ay) * bdx) / det;
            u = ((bx - ax) * ady - (by - ay) * adx) / det;
            if (t <= 0.001 || Math.abs(u) <= 0.001) {
                return null;
            }
            x = snap(ax + adx * t);
            y = snap(ay + ady * t);
            if (Math.hypot(x - ax, y - ay) > MAX_ROOM || Math.hypot(x - bx, y - by) < MIN_WALL - 0.001 || Math.hypot(x - ax, y - ay) < MIN_WALL - 0.001) {
                return null;
            }
            if (!segmentDirectionOk({ x1: ax, y1: ay, x2: x, y2: y }) || !segmentDirectionOk({ x1: bx, y1: by, x2: x, y2: y })) {
                return null;
            }
            return { x: x, y: y };
        }

        function neighborsAt(list, x, y, skipId) {
            var key = pointKey(x, y);
            var found = [];
            (list || []).forEach(function (segment) {
                if (segment.id === skipId) {
                    return;
                }
                if (pointKey(segment.x1, segment.y1) === key) {
                    found.push({ x: segment.x2, y: segment.y2 });
                } else if (pointKey(segment.x2, segment.y2) === key) {
                    found.push({ x: segment.x1, y: segment.y1 });
                }
            });
            return found;
        }

        function moveCorner(list, x, y, nx, ny) {
            var key = pointKey(x, y);
            list.forEach(function (segment) {
                var moved = false;
                if (pointKey(segment.x1, segment.y1) === key) {
                    segment.x1 = nx;
                    segment.y1 = ny;
                    moved = true;
                }
                if (pointKey(segment.x2, segment.y2) === key) {
                    segment.x2 = nx;
                    segment.y2 = ny;
                    moved = true;
                }
                if (moved) {
                    clampBulge(segment);
                    orderSegment(segment);
                }
            });
        }

        function cornerChoices(pivotX, pivotY, desiredX, desiredY, neighbors) {
            var ray = angleRay(Math.atan2(desiredY - pivotY, desiredX - pivotX));
            var choices = [];
            var seen = {};
            function add(point) {
                var key;
                var agreed;
                if (!point) {
                    return;
                }
                agreed = neighbors.every(function (neighbor) {
                    return segmentDirectionOk({ x1: neighbor.x, y1: neighbor.y, x2: point.x, y2: point.y }) && Math.hypot(point.x - neighbor.x, point.y - neighbor.y) >= MIN_WALL - 0.001;
                });
                if (!agreed) {
                    return;
                }
                key = pointKey(point.x, point.y);
                if (seen[key]) {
                    return;
                }
                seen[key] = true;
                choices.push({
                    x: point.x,
                    y: point.y,
                    dist: Math.hypot(point.x - desiredX, point.y - desiredY)
                });
            }
            if (neighbors.length) {
                CORNER_RAYS.forEach(function (dir) {
                    add(rayPoint(pivotX, pivotY, ray[0], ray[1], neighbors[0].x, neighbors[0].y, dir[0], dir[1]));
                });
            }
            add({ x: desiredX, y: desiredY });
            choices.sort(function (a, b) {
                return a.dist - b.dist;
            });
            return choices;
        }

        function closeCorner(list, segmentId, ox, oy, pivotX, pivotY, desiredX, desiredY) {
            var neighbors = neighborsAt(list, ox, oy, segmentId);
            var choices;
            var index;
            var trial;
            if (!neighbors.length) {
                moveCorner(list, ox, oy, desiredX, desiredY);
                return true;
            }
            choices = cornerChoices(pivotX, pivotY, desiredX, desiredY, neighbors);
            for (index = 0; index < choices.length; index += 1) {
                trial = cloneSegments(list);
                moveCorner(trial, ox, oy, choices[index].x, choices[index].y);
                if (segmentsOk(trial)) {
                    list.length = 0;
                    trial.forEach(function (segment) {
                        list.push(segment);
                    });
                    return true;
                }
            }
            return false;
        }

        function wallDegrees(wall) {
            var degrees = Math.round(Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1) * 180 / Math.PI);
            return ((degrees % 180) + 180) % 180;
        }

        function copySegment(segment) {
            var copy = {
                id: segment.id,
                x1: segment.x1,
                y1: segment.y1,
                x2: segment.x2,
                y2: segment.y2
            };
            if (segment.bulge && Math.abs(segment.bulge) >= 0.05) {
                copy.bulge = segment.bulge;
            }
            return copy;
        }

        function clampBulge(segment) {
            var chord;
            var limit;
            if (!segment || !segment.bulge) {
                return;
            }
            chord = segmentSpan(segment);
            limit = chord / 2;
            if (Math.abs(segment.bulge) < 0.5 || limit < 0.5) {
                delete segment.bulge;
                return;
            }
            if (Math.abs(segment.bulge) > limit) {
                segment.bulge = (segment.bulge < 0 ? -1 : 1) * limit;
            }
        }

        function sagittaBetween(host, x1, y1, x2, y2) {
            var mid;
            var mx;
            var my;
            var dx;
            var dy;
            var len;
            var signed;
            if (!host || !host.bulge || Math.abs(host.bulge) < 0.05) {
                return 0;
            }
            mid = pointOnArc(host.x1, host.y1, host.x2, host.y2, host.bulge, (parameterOf(host, x1, y1) + parameterOf(host, x2, y2)) / 2);
            mx = (x1 + x2) / 2;
            my = (y1 + y2) / 2;
            dx = x2 - x1;
            dy = y2 - y1;
            len = Math.hypot(dx, dy) || 1;
            signed = snap((mid.x - mx) * (-dy / len) + (mid.y - my) * (dx / len));
            return Math.abs(signed) < 0.5 ? 0 : signed;
        }

        function curveClear(segment, bulge) {
            var step;
            var point;
            var blocked = false;
            if (!bulge || Math.abs(bulge) < 0.05) {
                return true;
            }
            for (step = 1; step < 8; step += 1) {
                point = pointOnArc(segment.x1, segment.y1, segment.x2, segment.y2, bulge, step / 8);
                (state.room.segments || []).forEach(function (other) {
                    if (blocked || other.id === segment.id) {
                        return;
                    }
                    if (distanceToChord(point.x, point.y, other) < 0.2) {
                        blocked = true;
                    }
                });
            }
            return !blocked;
        }

        function distanceToChord(px, py, segment) {
            var dx = segment.x2 - segment.x1;
            var dy = segment.y2 - segment.y1;
            var len2 = dx * dx + dy * dy || 1;
            var t = Math.max(0, Math.min(1, ((px - segment.x1) * dx + (py - segment.y1) * dy) / len2));
            return Math.hypot(px - (segment.x1 + dx * t), py - (segment.y1 + dy * t));
        }

        function expandFacePoints(face, segments) {
            var byId = {};
            var points = [];
            var count;
            var index;
            var start;
            var end;
            var segment;
            var samples;
            (segments || []).forEach(function (segmentItem) {
                byId[segmentItem.id] = segmentItem;
            });
            count = face.points.length;
            for (index = 0; index < count; index += 1) {
                start = face.points[index];
                end = face.points[(index + 1) % count];
                segment = byId[face.edgeIds[index]];
                samples = arcSamplesBetween(segment, start, end);
                samples.forEach(function (sample, sampleIndex) {
                    var previous;
                    if (sampleIndex === samples.length - 1) {
                        return;
                    }
                    previous = points[points.length - 1];
                    if (previous && Math.hypot(previous[0] - sample[0], previous[1] - sample[1]) < 0.02) {
                        return;
                    }
                    points.push(sample);
                });
            }
            return points.length >= 4 ? points : face.points.map(function (point) {
                return [point[0], point[1]];
            });
        }

        function arcSamplesBetween(segment, start, end) {
            var t0;
            var t1;
            var steps = 8;
            var points = [];
            var index;
            var t;
            var point;
            if (!segment || !segment.bulge || Math.abs(segment.bulge) < 0.05) {
                return [start, end];
            }
            t0 = parameterOf(segment, start[0], start[1]);
            t1 = parameterOf(segment, end[0], end[1]);
            for (index = 0; index <= steps; index += 1) {
                t = t0 + (t1 - t0) * (index / steps);
                point = pointOnArc(segment.x1, segment.y1, segment.x2, segment.y2, segment.bulge, t);
                points.push([Math.round(point.x * 100) / 100, Math.round(point.y * 100) / 100]);
            }
            return points;
        }

        function arcPath(x1, y1, x2, y2, bulge) {
            var radius;
            if (!bulge || Math.abs(bulge) < 0.05) {
                return 'M ' + num(x1) + ' ' + num(y1) + ' L ' + num(x2) + ' ' + num(y2);
            }
            radius = arcRadius(Math.hypot(x2 - x1, y2 - y1), bulge);
            return 'M ' + num(x1) + ' ' + num(y1) + ' A ' + num(radius) + ' ' + num(radius) + ' 0 0 ' + (bulge > 0 ? 1 : 0) + ' ' + num(x2) + ' ' + num(y2);
        }

        function subArcPath(wall, startDist, endDist) {
            var start = pointAlongWall(wall, startDist);
            var end = pointAlongWall(wall, endDist);
            var radius;
            if (!wall.bulge || Math.abs(wall.bulge) < 0.05) {
                return 'M ' + num(start.x) + ' ' + num(start.y) + ' L ' + num(end.x) + ' ' + num(end.y);
            }
            radius = arcRadius(Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1), wall.bulge);
            return 'M ' + num(start.x) + ' ' + num(start.y) + ' A ' + num(radius) + ' ' + num(radius) + ' 0 0 ' + (wall.bulge > 0 ? 1 : 0) + ' ' + num(end.x) + ' ' + num(end.y);
        }

        function pointsBounds(points) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            (points || []).forEach(function (point) {
                minX = Math.min(minX, point[0]);
                minY = Math.min(minY, point[1]);
                maxX = Math.max(maxX, point[0]);
                maxY = Math.max(maxY, point[1]);
            });
            if (!isFinite(minX)) {
                return { width: 0, depth: 0 };
            }
            return {
                width: snap(maxX - minX),
                depth: snap(maxY - minY)
            };
        }

        function segmentBounds(list) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            (list || []).forEach(function (segment) {
                var apex;
                minX = Math.min(minX, segment.x1, segment.x2);
                minY = Math.min(minY, segment.y1, segment.y2);
                maxX = Math.max(maxX, segment.x1, segment.x2);
                maxY = Math.max(maxY, segment.y1, segment.y2);
                if (segment.bulge && Math.abs(segment.bulge) >= 0.05) {
                    apex = pointOnArc(segment.x1, segment.y1, segment.x2, segment.y2, segment.bulge, 0.5);
                    minX = Math.min(minX, apex.x);
                    minY = Math.min(minY, apex.y);
                    maxX = Math.max(maxX, apex.x);
                    maxY = Math.max(maxY, apex.y);
                }
            });
            if (!isFinite(minX)) {
                return { minX: 0, minY: 0, width: 0, depth: 0 };
            }
            return {
                minX: minX,
                minY: minY,
                width: snap(maxX - minX),
                depth: snap(maxY - minY)
            };
        }

        function rangesOverlap(a1, a2, b1, b2) {
            return Math.min(Math.max(a1, a2), Math.max(b1, b2)) - Math.max(Math.min(a1, a2), Math.min(b1, b2));
        }

        function pointOnSegment(px, py, segment) {
            var dx = segment.x2 - segment.x1;
            var dy = segment.y2 - segment.y1;
            var len2 = dx * dx + dy * dy;
            var t;
            var qx;
            var qy;
            if (Math.hypot(px - segment.x1, py - segment.y1) <= 0.02 || Math.hypot(px - segment.x2, py - segment.y2) <= 0.02) {
                return false;
            }
            if (len2 < 0.0001) {
                return false;
            }
            t = ((px - segment.x1) * dx + (py - segment.y1) * dy) / len2;
            if (t <= 0.001 || t >= 0.999) {
                return false;
            }
            qx = segment.x1 + t * dx;
            qy = segment.y1 + t * dy;
            return Math.hypot(px - qx, py - qy) <= 0.08 && Math.hypot(px - segment.x1, py - segment.y1) > 0.02 && Math.hypot(px - segment.x2, py - segment.y2) > 0.02;
        }

        function collinearOverlap(a, b) {
            var adx = a.x2 - a.x1;
            var ady = a.y2 - a.y1;
            var bdx = b.x2 - b.x1;
            var bdy = b.y2 - b.y1;
            var alen = Math.hypot(adx, ady) || 1;
            var blen = Math.hypot(bdx, bdy) || 1;
            var cross = Math.abs((adx / alen) * (bdy / blen) - (ady / alen) * (bdx / blen));
            var dist;
            var b0;
            var b1;
            if (cross > 0.04) {
                return false;
            }
            dist = Math.abs((b.x1 - a.x1) * (-ady) + (b.y1 - a.y1) * adx) / alen;
            if (dist > 0.08) {
                return false;
            }
            b0 = ((b.x1 - a.x1) * adx + (b.y1 - a.y1) * ady) / alen;
            b1 = ((b.x2 - a.x1) * adx + (b.y2 - a.y1) * ady) / alen;
            return rangesOverlap(0, alen, b0, b1) > 0.05;
        }

        function improperCross(a, b) {
            if (collinearOverlap(a, b)) {
                return true;
            }
            if (pointKey(a.x1, a.y1) === pointKey(b.x1, b.y1) || pointKey(a.x1, a.y1) === pointKey(b.x2, b.y2) || pointKey(a.x2, a.y2) === pointKey(b.x1, b.y1) || pointKey(a.x2, a.y2) === pointKey(b.x2, b.y2)) {
                return false;
            }
            if (pointOnSegment(a.x1, a.y1, b) || pointOnSegment(a.x2, a.y2, b) || pointOnSegment(b.x1, b.y1, a) || pointOnSegment(b.x2, b.y2, a)) {
                return false;
            }
            return segmentsCross([a.x1, a.y1], [a.x2, a.y2], [b.x1, b.y1], [b.x2, b.y2]);
        }

        function segmentsOk(list) {
            var index;
            var other;
            var bounds;
            if (!list || !list.length) {
                return true;
            }
            for (index = 0; index < list.length; index += 1) {
                if (!segmentDirectionOk(list[index])) {
                    return false;
                }
                if (segmentSpan(list[index]) < MIN_WALL - 0.001) {
                    return false;
                }
            }
            bounds = segmentBounds(list);
            if (bounds.width > MAX_ROOM + 0.001 || bounds.depth > MAX_ROOM + 0.001) {
                return false;
            }
            for (index = 0; index < list.length; index += 1) {
                for (other = index + 1; other < list.length; other += 1) {
                    if (improperCross(list[index], list[other])) {
                        return false;
                    }
                }
            }
            return true;
        }

        function endpointDegree(list, x, y) {
            var key = pointKey(x, y);
            var count = 0;
            (list || []).forEach(function (segment) {
                if (pointKey(segment.x1, segment.y1) === key) {
                    count += 1;
                }
                if (pointKey(segment.x2, segment.y2) === key) {
                    count += 1;
                }
            });
            return count;
        }

        function signedArea(points) {
            var sum = 0;
            var index;
            var next;
            for (index = 0; index < points.length; index += 1) {
                next = points[(index + 1) % points.length];
                sum += points[index][0] * next[1] - next[0] * points[index][1];
            }
            return sum / 2;
        }

        function bestCycle(list) {
            var adj = {};
            var best = null;
            var seen = {};
            var previous = {};
            (state.room.edgeIds || []).forEach(function (id) {
                previous[id] = true;
            });
            function addEdge(key, entry) {
                if (!adj[key]) {
                    adj[key] = [];
                }
                adj[key].push(entry);
            }
            (list || []).forEach(function (segment) {
                var start = pointKey(segment.x1, segment.y1);
                var end = pointKey(segment.x2, segment.y2);
                if (start === end) {
                    return;
                }
                addEdge(start, { id: segment.id, to: end, x: snap(segment.x2), y: snap(segment.y2) });
                addEdge(end, { id: segment.id, to: start, x: snap(segment.x1), y: snap(segment.y1) });
            });
            function hasPoint(points, key) {
                var index;
                for (index = 0; index < points.length; index += 1) {
                    if (pointKey(points[index][0], points[index][1]) === key) {
                        return true;
                    }
                }
                return false;
            }
            function consider(points, edgeIds) {
                var signature = edgeIds.slice().sort().join('|');
                var area;
                var overlap = 0;
                if (seen[signature] || polygonProblem(points)) {
                    return;
                }
                seen[signature] = true;
                area = Math.abs(signedArea(points));
                edgeIds.forEach(function (id) {
                    if (previous[id]) {
                        overlap += 1;
                    }
                });
                if (!best || area > best.area + 0.05 || (Math.abs(area - best.area) <= 0.05 && overlap > best.overlap)) {
                    best = {
                        points: points.map(function (point) {
                            return [point[0], point[1]];
                        }),
                        edgeIds: edgeIds.slice(),
                        area: area,
                        overlap: overlap
                    };
                }
            }
            function search(startKey, currentKey, points, edgeIds, used) {
                var edges = adj[currentKey] || [];
                var index;
                var edge;
                if (points.length > 16) {
                    return;
                }
                for (index = 0; index < edges.length; index += 1) {
                    edge = edges[index];
                    if (used[edge.id]) {
                        continue;
                    }
                    if (edge.to === startKey) {
                        if (points.length >= 4) {
                            consider(points, edgeIds.concat([edge.id]));
                        }
                        continue;
                    }
                    if (hasPoint(points, edge.to)) {
                        continue;
                    }
                    used[edge.id] = true;
                    points.push([edge.x, edge.y]);
                    edgeIds.push(edge.id);
                    search(startKey, edge.to, points, edgeIds, used);
                    edgeIds.pop();
                    points.pop();
                    used[edge.id] = false;
                }
            }
            Object.keys(adj).forEach(function (startKey) {
                var parts = startKey.split(',');
                search(startKey, startKey, [[Number(parts[0]), Number(parts[1])]], [], {});
            });
            return best;
        }

        function normalizeSegmentOrigin() {
            var bounds = segmentBounds(state.room.segments);
            if (!state.room.segments || !state.room.segments.length) {
                return;
            }
            if (Math.abs(bounds.minX) < 0.001 && Math.abs(bounds.minY) < 0.001) {
                return;
            }
            state.room.segments.forEach(function (segment) {
                segment.x1 = snap(segment.x1 - bounds.minX);
                segment.y1 = snap(segment.y1 - bounds.minY);
                segment.x2 = snap(segment.x2 - bounds.minX);
                segment.y2 = snap(segment.y2 - bounds.minY);
            });
            shiftItems(bounds.minX, bounds.minY);
        }

        function splitAtJunctions() {
            var skipped = {};
            var guard = 0;
            function junctionKey(id, x, y) {
                return id + '@' + pointKey(x, y);
            }
            function findJunction() {
                var hostIndex;
                var otherIndex;
                var host;
                var other;
                var points;
                var pointIndex;
                var along;
                var length;
                for (hostIndex = 0; hostIndex < state.room.segments.length; hostIndex += 1) {
                    host = state.room.segments[hostIndex];
                    length = arcLengthOf(segmentSpan(host), host.bulge || 0);
                    for (otherIndex = 0; otherIndex < state.room.segments.length; otherIndex += 1) {
                        if (otherIndex === hostIndex) {
                            continue;
                        }
                        other = state.room.segments[otherIndex];
                        points = [[other.x1, other.y1], [other.x2, other.y2]];
                        for (pointIndex = 0; pointIndex < points.length; pointIndex += 1) {
                            if (!pointOnSegment(points[pointIndex][0], points[pointIndex][1], host)) {
                                continue;
                            }
                            if (skipped[junctionKey(host.id, points[pointIndex][0], points[pointIndex][1])]) {
                                continue;
                            }
                            along = arcDistanceTo(host, points[pointIndex][0], points[pointIndex][1]);
                            if (along < MIN_WALL - 0.001 || length - along < MIN_WALL - 0.001) {
                                skipped[junctionKey(host.id, points[pointIndex][0], points[pointIndex][1])] = true;
                                continue;
                            }
                            return {
                                host: host,
                                x: points[pointIndex][0],
                                y: points[pointIndex][1],
                                along: along
                            };
                        }
                    }
                }
                return null;
            }
            while (guard < 24) {
                var junction = findJunction();
                var first;
                var second;
                var index;
                guard += 1;
                if (!junction) {
                    return;
                }
                first = {
                    id: junction.host.id,
                    x1: junction.host.x1,
                    y1: junction.host.y1,
                    x2: junction.x,
                    y2: junction.y
                };
                second = {
                    id: uid('w'),
                    x1: junction.x,
                    y1: junction.y,
                    x2: junction.host.x2,
                    y2: junction.host.y2
                };
                orderSegment(first);
                orderSegment(second);
                first.bulge = sagittaBetween(junction.host, first.x1, first.y1, first.x2, first.y2);
                second.bulge = sagittaBetween(junction.host, second.x1, second.y1, second.x2, second.y2);
                if (!first.bulge) {
                    delete first.bulge;
                }
                if (!second.bulge) {
                    delete second.bulge;
                }
                index = state.room.segments.indexOf(junction.host);
                state.room.segments.splice(index, 1, first, second);
                state.openings.forEach(function (opening) {
                    if (opening.wall !== junction.host.id) {
                        return;
                    }
                    if (opening.offset >= junction.along - 0.01) {
                        opening.wall = second.id;
                        opening.offset = snap(opening.offset - junction.along);
                    } else if (opening.offset + opening.width > junction.along + 0.01) {
                        opening.width = snap(junction.along - opening.offset);
                    }
                });
            }
        }

        function applySegmentModel(split) {
            var cycle;
            var bounds;
            (state.room.segments || []).forEach(orderSegment);
            if (split) {
                splitAtJunctions();
                (state.room.segments || []).forEach(orderSegment);
            }
            cycle = bestCycle(state.room.segments || []);
            bounds = segmentBounds(state.room.segments || []);
            var floorBounds = cycle ? pointsBounds(cycle.points) : null;
            var traced = traceFaces(state.room.segments || []);
            state.room.kind = 'custom';
            state.room.shape = 'custom';
            state.room.cutW = 0;
            state.room.cutD = 0;
            state.room.points = cycle ? cycle.points : [];
            state.room.edgeIds = cycle ? cycle.edgeIds : [];
            state.room.faces = traced.map(function (face) {
                return expandFacePoints(face, state.room.segments);
            });
            if (!state.room.faces.length && cycle) {
                state.room.faces = [cycle.points.map(function (point) {
                    return [point[0], point[1]];
                })];
            }
            state.room.width = Math.max(floorBounds ? floorBounds.width : 0, bounds.width);
            state.room.depth = Math.max(floorBounds ? floorBounds.depth : 0, bounds.depth);
            state.room.spanW = Math.max(state.room.width, snap(bounds.minX + bounds.width));
            state.room.spanD = Math.max(state.room.depth, snap(bounds.minY + bounds.depth));
            dropUnknownOpenings();
            normalizeOpenings();
            normalizeItems();
            dropMissingSelection();
        }

        function syncFromSegments(split) {
            applySegmentModel(split);
            if (widthInput) {
                syncSizeInputs();
                syncShapeButtons();
            }
        }

        function findSegment(id) {
            var index;
            var list = state.room.segments || [];
            for (index = 0; index < list.length; index += 1) {
                if (list[index].id === id) {
                    return list[index];
                }
            }
            return null;
        }

        function moveEndpoints(segments, points, dx, dy) {
            var keys = {};
            points.forEach(function (point) {
                keys[pointKey(point.x, point.y)] = true;
            });
            segments.forEach(function (segment) {
                if (keys[pointKey(segment.x1, segment.y1)]) {
                    segment.x1 = snap(segment.x1 + dx);
                    segment.y1 = snap(segment.y1 + dy);
                }
                if (keys[pointKey(segment.x2, segment.y2)]) {
                    segment.x2 = snap(segment.x2 + dx);
                    segment.y2 = snap(segment.y2 + dy);
                }
            });
        }

        function pullSquare(segments, ox, oy, nx, ny) {
            var dx = snap(nx) - snap(ox);
            var dy = snap(ny) - snap(oy);
            var moving = {};
            var guard = 0;
            var grew = true;
            moving[pointKey(ox, oy)] = true;
            while (grew && guard < 30) {
                guard += 1;
                grew = false;
                segments.forEach(function (segment) {
                    var vertical = Math.abs(segment.x1 - segment.x2) <= 0.001;
                    var horizontal = Math.abs(segment.y1 - segment.y2) <= 0.001;
                    var across = (Math.abs(dx) > 0.001 && vertical) || (Math.abs(dy) > 0.001 && horizontal);
                    var key1 = pointKey(segment.x1, segment.y1);
                    var key2 = pointKey(segment.x2, segment.y2);
                    if (!across) {
                        return;
                    }
                    if (moving[key1] && !moving[key2]) {
                        moving[key2] = true;
                        grew = true;
                    } else if (moving[key2] && !moving[key1]) {
                        moving[key1] = true;
                        grew = true;
                    }
                });
            }
            segments.forEach(function (segment) {
                var move1 = !!moving[pointKey(segment.x1, segment.y1)];
                var move2 = !!moving[pointKey(segment.x2, segment.y2)];
                if (move1) {
                    segment.x1 = snap(segment.x1 + dx);
                    segment.y1 = snap(segment.y1 + dy);
                }
                if (move2) {
                    segment.x2 = snap(segment.x2 + dx);
                    segment.y2 = snap(segment.y2 + dy);
                }
            });
        }

        function nearestAnchor(x, y, ignoreId, maxDist) {
            var best = null;
            (state.room.segments || []).forEach(function (segment) {
                var dx;
                var dy;
                var len2;
                var t;
                var px;
                var py;
                var dist;
                if (segment.id === ignoreId) {
                    return;
                }
                [[segment.x1, segment.y1], [segment.x2, segment.y2]].forEach(function (point) {
                    dist = Math.hypot(point[0] - x, point[1] - y);
                    if (dist <= maxDist && (!best || dist < best.dist)) {
                        best = { x: point[0], y: point[1], dist: dist };
                    }
                });
                dx = segment.x2 - segment.x1;
                dy = segment.y2 - segment.y1;
                len2 = dx * dx + dy * dy || 1;
                t = ((x - segment.x1) * dx + (y - segment.y1) * dy) / len2;
                if (t <= 0.02 || t >= 0.98) {
                    return;
                }
                px = snap(segment.x1 + dx * t);
                py = snap(segment.y1 + dy * t);
                dist = Math.hypot(px - x, py - y);
                if (dist <= maxDist && (!best || dist < best.dist)) {
                    best = { x: px, y: py, dist: dist };
                }
            });
            return best;
        }

        function openEnds(list) {
            var counts = {};
            var points = [];
            function add(x, y, segment) {
                var key = pointKey(x, y);
                if (!counts[key]) {
                    counts[key] = { x: snap(x), y: snap(y), n: 0, segment: segment };
                    points.push(counts[key]);
                }
                counts[key].n += 1;
            }
            (list || []).forEach(function (segment) {
                add(segment.x1, segment.y1, segment);
                add(segment.x2, segment.y2, segment);
            });
            return points.filter(function (point) {
                return point.n === 1;
            });
        }

        function parkedWall(length, vertical, originX, originY, sign) {
            var segment = {
                id: uid('w'),
                x1: snap(originX),
                y1: snap(originY),
                x2: snap(originX),
                y2: snap(originY)
            };
            if (vertical) {
                segment.y2 = snap(originY + sign * length);
            } else {
                segment.x2 = snap(originX + sign * length);
            }
            orderSegment(segment);
            return segment;
        }

        function snapNewWall(segment) {
            var vertical = Math.abs(segment.x1 - segment.x2) <= 0.001;
            var first = nearestAnchor(segment.x1, segment.y1, segment.id, 0.75);
            var second = nearestAnchor(segment.x2, segment.y2, segment.id, 0.75);
            var pick = null;
            var which = 1;
            if (first && (!second || first.dist <= second.dist)) {
                pick = first;
            } else if (second) {
                pick = second;
                which = 2;
            }
            if (!pick) {
                return;
            }
            var dx = pick.x - (which === 1 ? segment.x1 : segment.x2);
            var dy = pick.y - (which === 1 ? segment.y1 : segment.y2);
            if (vertical && Math.abs(pick.x - segment.x1) > 0.001 && Math.abs(dy) > 0.001 && Math.abs(dx) > 0.001) {
                segment.x1 = snap(segment.x1 + dx);
                segment.x2 = segment.x1;
                segment.y1 = snap(segment.y1 + dy);
                segment.y2 = snap(segment.y2 + dy);
            } else if (!vertical && Math.abs(pick.y - segment.y1) > 0.001 && Math.abs(dx) > 0.001 && Math.abs(dy) > 0.001) {
                segment.y1 = snap(segment.y1 + dy);
                segment.y2 = segment.y1;
                segment.x1 = snap(segment.x1 + dx);
                segment.x2 = snap(segment.x2 + dx);
            } else {
                segment.x1 = snap(segment.x1 + dx);
                segment.y1 = snap(segment.y1 + dy);
                segment.x2 = snap(segment.x2 + dx);
                segment.y2 = snap(segment.y2 + dy);
            }
            orderSegment(segment);
        }

        function wallAt(length, vertical, feet) {
            var segment;
            if (vertical) {
                segment = {
                    id: uid('w'),
                    x1: snap(feet.x),
                    y1: snap(feet.y - length / 2),
                    x2: snap(feet.x),
                    y2: snap(feet.y - length / 2) + length
                };
            } else {
                segment = {
                    id: uid('w'),
                    x1: snap(feet.x - length / 2),
                    y1: snap(feet.y),
                    x2: snap(feet.x - length / 2) + length,
                    y2: snap(feet.y)
                };
            }
            orderSegment(segment);
            snapNewWall(segment);
            return segment;
        }

        function acceptWall(segment) {
            var next = (state.room.segments || []).concat([segment]);
            if (segmentSpan(segment) < MIN_WALL - 0.001 || !segmentsOk(next)) {
                return false;
            }
            state.room.segments = next;
            syncFromSegments(true);
            state.selected = { type: 'wall', id: segment.id };
            persist();
            renderPlan();
            renderSelection();
            if (state.room.points && state.room.points.length >= 4) {
                setStatus('Wall added. Drag a wall or its ends to keep shaping the room.');
            } else {
                setStatus('Wall added. Connect the open ends to close the room.');
            }
            return true;
        }

        function snapDrawPoint(x, y) {
            var points = [];
            var best = null;
            (state.room.segments || []).forEach(function (segment) {
                points.push([segment.x1, segment.y1], [segment.x2, segment.y2]);
            });
            if (!points.length) {
                var corners = state.room.points && state.room.points.length ? state.room.points : layout().polygon;
                corners.forEach(function (point) {
                    points.push(point);
                });
            }
            points.forEach(function (point) {
                var dist = Math.hypot(point[0] - x, point[1] - y);
                if (dist <= 0.75 && (!best || dist < best.dist)) {
                    best = { x: snap(point[0]), y: snap(point[1]), dist: dist };
                }
            });
            if (best) {
                return { x: best.x, y: best.y };
            }
            return { x: snap(x), y: snap(y) };
        }

        function drawnEnd(start, feet) {
            return endAtAngle(start.x, start.y, Math.atan2(feet.y - start.y, feet.x - start.x), Math.hypot(feet.x - start.x, feet.y - start.y));
        }

        function showDrawPreview(start, end, length) {
            var group = svg.querySelector('.room-builder__draw-preview');
            var midX = (start.x + end.x) / 2;
            var midY = (start.y + end.y) / 2;
            var label = length >= 0.5 ? formatFeet(length) + ' ft' : '';
            if (!group) {
                group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('class', 'room-builder__draw-preview');
                group.setAttribute('pointer-events', 'none');
                svg.appendChild(group);
            }
            group.innerHTML = '<line x1="' + num(start.x) + '" y1="' + num(start.y) + '" x2="' + num(end.x) + '" y2="' + num(end.y) + '"></line>' +
                '<text text-anchor="middle" font-size="0.42" x="' + num(midX) + '" y="' + num(midY - 0.28) + '">' + label + '</text>';
        }

        function clearDrawPreview() {
            var group = svg.querySelector('.room-builder__draw-preview');
            if (group && group.parentNode) {
                group.parentNode.removeChild(group);
            }
        }

        function placeDrawnWall(start, end) {
            var before = captureRoomState();
            var segment;
            ensureCustom();
            segment = {
                id: uid('w'),
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y
            };
            orderSegment(segment);
            snapNewWall(segment);
            if (!acceptWall(segment)) {
                restoreRoomState(before);
                syncShapeButtons();
                renderPlan();
                setStatus('That wall would cross another wall.');
            }
        }

        function placeWallPiece(length, vertical, feet) {
            var before = captureRoomState();
            var ends;
            var signs = [1, -1];
            var index;
            var segment;
            ensureCustom();
            if (!feet) {
                ends = openEnds(state.room.segments);
                if (ends.length) {
                    var source = ends[0].segment;
                    var turnVertical = Math.abs(source.y1 - source.y2) <= 0.001;
                    for (index = 0; index < signs.length; index += 1) {
                        segment = parkedWall(length, turnVertical, ends[0].x, ends[0].y, signs[index]);
                        if (acceptWall(segment)) {
                            return;
                        }
                    }
                }
                segment = parkedWall(length, false, state.room.width || 0, 0, 1);
                if (acceptWall(segment)) {
                    return;
                }
                segment = parkedWall(length, true, state.room.width || 0, 0, 1);
                if (acceptWall(segment)) {
                    return;
                }
                restoreRoomState(before);
                syncShapeButtons();
                renderPlan();
                setStatus('That wall would cross another wall.');
                return;
            }
            segment = wallAt(length, vertical, feet);
            if (!acceptWall(segment)) {
                restoreRoomState(before);
                syncShapeButtons();
                renderPlan();
                setStatus('That wall would cross another wall.');
            }
        }

        function captureRoomState() {
            return JSON.parse(JSON.stringify({
                room: state.room,
                items: state.items,
                openings: state.openings
            }));
        }

        function restoreRoomState(snapshot) {
            state.room = snapshot.room;
            state.items = snapshot.items;
            state.openings = snapshot.openings;
        }

        function applyWallDelta(next, drag, feet) {
            var dx = snap(feet.x - drag.start.x);
            var dy = snap(feet.y - drag.start.y);
            var segment = drag.segment;
            var ox;
            var oy;
            var fx;
            var fy;
            var nx;
            var ny;
            var degree;
            if (drag.kind === 'wall-body') {
                if (drag.degree1 >= 2 || drag.degree2 >= 2) {
                    var slide = slideDelta(segment, dx, dy);
                    dx = slide.dx;
                    dy = slide.dy;
                    moveEndpoints(next, [
                        { x: segment.x1, y: segment.y1 },
                        { x: segment.x2, y: segment.y2 }
                    ], dx, dy);
                } else {
                    next.forEach(function (item) {
                        if (item.id !== segment.id) {
                            return;
                        }
                        item.x1 = snap(segment.x1 + dx);
                        item.y1 = snap(segment.y1 + dy);
                        item.x2 = snap(segment.x2 + dx);
                        item.y2 = snap(segment.y2 + dy);
                    });
                }
                return true;
            }
            ox = drag.end === '1' ? segment.x1 : segment.x2;
            oy = drag.end === '1' ? segment.y1 : segment.y2;
            fx = drag.end === '1' ? segment.x2 : segment.x1;
            fy = drag.end === '1' ? segment.y2 : segment.y1;
            var swung = swungEnd(fx, fy, ox, oy, feet);
            var oldAngle = Math.atan2(oy - fy, ox - fx);
            var newAngle = Math.atan2(swung.y - fy, swung.x - fx);
            nx = swung.x;
            ny = swung.y;
            drag.rotated = Math.abs(Math.atan2(Math.sin(newAngle - oldAngle), Math.cos(newAngle - oldAngle))) > 0.2;
            if (Math.hypot(nx - fx, ny - fy) < MIN_WALL - 0.001) {
                return false;
            }
            degree = drag.end === '1' ? drag.degree1 : drag.degree2;
            if (degree >= 2 && drag.rotated) {
                return closeCorner(next, segment.id, ox, oy, fx, fy, nx, ny);
            }
            if (degree >= 2 && !drag.rotated) {
                pullSquare(next, ox, oy, nx, ny);
            } else {
                next.forEach(function (item) {
                    if (item.id !== segment.id) {
                        return;
                    }
                    if (drag.end === '1') {
                        item.x1 = nx;
                        item.y1 = ny;
                    } else {
                        item.x2 = nx;
                        item.y2 = ny;
                    }
                    clampBulge(item);
                });
            }
            return true;
        }

        function previewCurveDrag(feet) {
            var source = null;
            var dx;
            var dy;
            var len;
            var mx;
            var my;
            var signed;
            var bulge;
            var next;
            var item = null;
            (drag.snapshot || []).forEach(function (segment) {
                if (segment.id === drag.id) {
                    source = segment;
                }
            });
            if (!source) {
                return;
            }
            dx = source.x2 - source.x1;
            dy = source.y2 - source.y1;
            len = Math.hypot(dx, dy) || 1;
            mx = (source.x1 + source.x2) / 2;
            my = (source.y1 + source.y2) / 2;
            signed = (feet.x - mx) * (-dy / len) + (feet.y - my) * (dx / len);
            bulge = snap(signed);
            if (Math.abs(bulge) < 0.5) {
                bulge = 0;
            }
            bulge = Math.max(-len / 2, Math.min(len / 2, bulge));
            next = cloneSegments(drag.snapshot);
            next.forEach(function (segment) {
                if (segment.id === drag.id) {
                    item = segment;
                }
            });
            if (!item || !curveClear(item, bulge)) {
                restoreRoomState(drag.goodState);
                renderPlan();
                return;
            }
            if (bulge) {
                item.bulge = bulge;
            } else {
                delete item.bulge;
            }
            drag.moved = true;
            state.room.segments = next;
            syncFromSegments(false);
            drag.goodState = captureRoomState();
            renderPlan();
        }

        function previewWallDrag(feet) {
            var next;
            state.items = JSON.parse(JSON.stringify(drag.itemSnapshot));
            state.openings = JSON.parse(JSON.stringify(drag.openingSnapshot));
            state.room.segments = cloneSegments(drag.snapshot);
            next = cloneSegments(drag.snapshot);
            if (!applyWallDelta(next, drag, feet) || !segmentsOk(next)) {
                restoreRoomState(drag.goodState);
                renderPlan();
                return;
            }
            state.room.segments = next;
            syncFromSegments(false);
            if (!drag.rotated && drag.goodState.room.points && drag.goodState.room.points.length >= 4 && (!state.room.points || state.room.points.length < 4)) {
                restoreRoomState(drag.goodState);
                renderPlan();
                return;
            }
            drag.goodState = captureRoomState();
            renderPlan();
        }

        function slideDelta(segment, dx, dy) {
            var len = segmentSpan(segment) || 1;
            var tx = (segment.x2 - segment.x1) / len;
            var ty = (segment.y2 - segment.y1) / len;
            var nx = -ty;
            var ny = tx;
            var dist = snap(dx * nx + dy * ny);
            var step;
            if (Math.abs(ty) <= 0.05) {
                return { dx: 0, dy: dist * (ny >= 0 ? 1 : -1) };
            }
            if (Math.abs(tx) <= 0.05) {
                return { dx: dist * (nx >= 0 ? 1 : -1), dy: 0 };
            }
            step = snap(dist / Math.SQRT2);
            if (Math.abs(step) < 0.5) {
                step = 0;
            }
            return {
                dx: (nx >= 0 ? 1 : -1) * Math.abs(step),
                dy: (ny >= 0 ? 1 : -1) * Math.abs(step)
            };
        }

        function swungEnd(pivotX, pivotY, originX, originY, feet) {
            var angle = Math.atan2(feet.y - pivotY, feet.x - pivotX);
            var length = Math.hypot(feet.x - pivotX, feet.y - pivotY);
            if (length < 0.4) {
                angle = Math.atan2(originY - pivotY, originX - pivotX);
                length = Math.hypot(originX - pivotX, originY - pivotY);
            }
            return endAtAngle(pivotX, pivotY, angle, length);
        }

        function snapDraggedWall(current, feet) {
            var segment = findSegment(current.id);
            var anchor;
            var x;
            var y;
            var nx;
            var ny;
            var degree;
            var next;
            var first;
            var second;
            var pick;
            var which;
            var dx;
            var dy;
            if (!segment) {
                return;
            }
            if (current.kind === 'wall-end') {
                var horizontalNow = Math.abs(segment.y1 - segment.y2) <= 0.001;
                var useEnd = current.end === '1' ? 1 : 2;
                if (feet) {
                    var distStart = Math.hypot(segment.x1 - feet.x, segment.y1 - feet.y);
                    var distEnd = Math.hypot(segment.x2 - feet.x, segment.y2 - feet.y);
                    useEnd = distStart <= distEnd ? 1 : 2;
                }
                x = useEnd === 1 ? segment.x1 : segment.x2;
                y = useEnd === 1 ? segment.y1 : segment.y2;
                if (endpointDegree(state.room.segments, x, y) >= 2) {
                    return;
                }
                anchor = nearestAnchor(x, y, segment.id, 0.75);
                if (!anchor) {
                    return;
                }
                nx = anchor.x;
                ny = anchor.y;
                degree = endpointDegree(state.room.segments, x, y);
                next = cloneSegments(state.room.segments);
                if (degree >= 2 && !current.rotated && horizontalNow && Math.abs(anchor.y - y) <= 0.001) {
                    pullSquare(next, x, y, nx, ny);
                } else if (degree >= 2 && !current.rotated && !horizontalNow && Math.abs(segment.x1 - segment.x2) <= 0.001 && Math.abs(anchor.x - x) <= 0.001) {
                    pullSquare(next, x, y, nx, ny);
                } else {
                    next.forEach(function (item) {
                        if (item.id !== segment.id) {
                            return;
                        }
                        if (useEnd === 1) {
                            item.x1 = nx;
                            item.y1 = ny;
                        } else {
                            item.x2 = nx;
                            item.y2 = ny;
                        }
                        clampBulge(item);
                    });
                }
                if (segmentsOk(next)) {
                    state.room.segments = next;
                }
                return;
            }
            if (current.degree1 >= 2 || current.degree2 >= 2) {
                return;
            }
            first = nearestAnchor(segment.x1, segment.y1, segment.id, 0.75);
            second = nearestAnchor(segment.x2, segment.y2, segment.id, 0.75);
            pick = null;
            which = 1;
            if (first && (!second || first.dist <= second.dist)) {
                pick = first;
            } else if (second) {
                pick = second;
                which = 2;
            }
            if (!pick) {
                return;
            }
            dx = pick.x - (which === 1 ? segment.x1 : segment.x2);
            dy = pick.y - (which === 1 ? segment.y1 : segment.y2);
            next = cloneSegments(state.room.segments);
            next.forEach(function (item) {
                if (item.id !== segment.id) {
                    return;
                }
                item.x1 = snap(item.x1 + dx);
                item.y1 = snap(item.y1 + dy);
                item.x2 = snap(item.x2 + dx);
                item.y2 = snap(item.y2 + dy);
            });
            if (segmentsOk(next)) {
                state.room.segments = next;
            }
        }

        function shiftItems(dx, dy) {
            state.items.forEach(function (item) {
                item.x = snap(item.x - dx);
                item.y = snap(item.y - dy);
            });
        }

        function knownWalls() {
            var ids = {};
            (state.room.segments || []).forEach(function (segment) {
                ids[segment.id] = true;
            });
            (state.room.edgeIds || []).forEach(function (id) {
                ids[id] = true;
            });
            return ids;
        }

        function dropUnknownOpenings() {
            var ids = knownWalls();
            state.openings = state.openings.filter(function (opening) {
                return ids[opening.wall];
            });
        }

        function mergeCollinear() {
            var points = state.room.points;
            var edgeIds = state.room.edgeIds;
            var guard = 0;
            var index;
            var count;
            var start;
            var middle;
            var end;
            var along;
            var across;
            var firstLength;
            while (guard < 24) {
                guard += 1;
                count = points.length;
                if (count < 4) {
                    return;
                }
                for (index = 0; index < count; index += 1) {
                    start = points[index];
                    middle = points[(index + 1) % count];
                    end = points[(index + 2) % count];
                    along = [middle[0] - start[0], middle[1] - start[1]];
                    across = [end[0] - middle[0], end[1] - middle[1]];
                    if (!edgeAxis(start, middle) || edgeAxis(start, middle) !== edgeAxis(middle, end)) {
                        continue;
                    }
                    if (along[0] * across[0] + along[1] * across[1] <= 0) {
                        continue;
                    }
                    firstLength = segmentLength(start, middle);
                    state.openings.forEach(function (opening) {
                        if (opening.wall === edgeIds[(index + 1) % count]) {
                            opening.wall = edgeIds[index];
                            opening.offset += firstLength;
                        }
                    });
                    points.splice((index + 1) % count, 1);
                    edgeIds.splice((index + 1) % count, 1);
                    break;
                }
                if (index === count) {
                    return;
                }
            }
        }

        function commitRoomPoints(points, edgeIds) {
            var problem = polygonProblem(points);
            var placed;
            if (problem) {
                setStatus(problem);
                return false;
            }
            placed = normalizeOrigin(points);
            problem = polygonProblem(placed.points);
            if (problem) {
                setStatus(problem);
                return false;
            }
            var previousCycle = {};
            (state.room.edgeIds || []).forEach(function (id) {
                previousCycle[id] = true;
            });
            var loose = (state.room.segments || []).filter(function (segment) {
                return !previousCycle[segment.id];
            }).map(function (segment) {
                return {
                    id: segment.id,
                    x1: snap(segment.x1 - placed.minX),
                    y1: snap(segment.y1 - placed.minY),
                    x2: snap(segment.x2 - placed.minX),
                    y2: snap(segment.y2 - placed.minY)
                };
            });
            shiftItems(placed.minX, placed.minY);
            state.room.points = placed.points;
            state.room.edgeIds = edgeIds.slice();
            state.room.kind = 'custom';
            state.room.shape = 'custom';
            state.room.width = placed.width;
            state.room.depth = placed.depth;
            state.room.cutW = 0;
            state.room.cutD = 0;
            state.room.segments = segmentsFromPolygon(placed.points, edgeIds).concat(loose);
            mergeCollinear();
            state.room.segments = segmentsFromPolygon(state.room.points, state.room.edgeIds).concat(loose);
            dropUnknownOpenings();
            normalizeOpenings();
            normalizeItems();
            dropMissingSelection();
            syncSizeInputs();
            syncShapeButtons();
            persist();
            renderPlan();
            renderSelection();
            return true;
        }

        function setWallLength(wallId, requested) {
            var segment;
            var nextLength;
            var current;
            var next;
            var nx;
            var ny;
            ensureCustom();
            segment = findSegment(wallId);
            nextLength = snap(requested);
            if (!segment || !isFinite(nextLength)) {
                return false;
            }
            orderSegment(segment);
            current = segmentSpan(segment);
            if (Math.abs(nextLength - current) < 0.001) {
                return true;
            }
            if (nextLength < MIN_WALL) {
                setStatus('Each wall needs to be at least ' + MIN_WALL + ' ft.');
                return false;
            }
            next = cloneSegments(state.room.segments);
            var turned = endAtAngle(segment.x1, segment.y1, Math.atan2(segment.y2 - segment.y1, segment.x2 - segment.x1), nextLength);
            nx = turned.x;
            ny = turned.y;
            if (endpointDegree(state.room.segments, segment.x2, segment.y2) >= 2) {
                pullSquare(next, segment.x2, segment.y2, nx, ny);
            } else {
                next.forEach(function (item) {
                    if (item.id !== wallId) {
                        return;
                    }
                    item.x2 = nx;
                    item.y2 = ny;
                    clampBulge(item);
                });
            }
            if (!segmentsOk(next)) {
                setStatus('That length would cross another wall or leave the plan.');
                return false;
            }
            var beforeLength = captureRoomState();
            state.room.segments = next;
            syncFromSegments(true);
            if (beforeLength.room.points && beforeLength.room.points.length >= 4 && (!state.room.points || state.room.points.length < 4)) {
                restoreRoomState(beforeLength);
                syncSizeInputs();
                syncShapeButtons();
                renderPlan();
                renderSelection();
                setStatus('The room needs to stay at least ' + MIN_ROOM + ' ft on each side.');
                return false;
            }
            persist();
            renderPlan();
            renderSelection();
            setStatus('Wall set to ' + formatFeet(nextLength) + ' ft.');
            return true;
        }

        function sideUnit(a, b, outward) {
            var dx = b[0] - a[0];
            var dy = b[1] - a[1];
            var len = Math.hypot(dx, dy) || 1;
            var lx;
            var ly;
            var outside;
            dx /= len;
            dy /= len;
            lx = dy;
            ly = -dx;
            outside = !pointInside((a[0] + b[0]) / 2 + lx * 0.35, (a[1] + b[1]) / 2 + ly * 0.35);
            if (!outside) {
                lx = -lx;
                ly = -ly;
            }
            if (!outward) {
                lx = -lx;
                ly = -ly;
            }
            return [lx, ly];
        }

        function addJog(wallId, from, span, depth, outward) {
            var wall;
            var points;
            var edgeIds;
            var count;
            var startPoint;
            var endPoint;
            var length;
            var fromStart;
            var directionX;
            var directionY;
            var normal;
            var begin;
            var finish;
            var outerStart;
            var outerEnd;
            var mids = [];
            var ids = [];
            var stubAtStart;
            var stubAtEnd;
            ensureCustom();
            wall = findWall(wallId);
            from = snap(from);
            span = snap(span);
            depth = snap(Math.abs(depth));
            if (!wall) {
                return false;
            }
            if (span < MIN_WALL || depth < MIN_WALL) {
                setStatus('The extra wall needs at least ' + MIN_WALL + ' ft of width and depth.');
                return false;
            }
            if (from < -0.001 || from + span > wall.length + 0.001) {
                setStatus('That extra wall does not fit on this wall.');
                return false;
            }
            stubAtStart = from >= 0.05;
            stubAtEnd = wall.length - from - span >= 0.05;
            if ((stubAtStart && from < MIN_WALL) || (stubAtEnd && wall.length - from - span < MIN_WALL)) {
                setStatus('Leave at least ' + MIN_WALL + ' ft beside the extra wall, or start it at the corner.');
                return false;
            }
            points = copyPoints(state.room.points);
            edgeIds = state.room.edgeIds.slice();
            count = points.length;
            startPoint = points[wall.index];
            endPoint = points[(wall.index + 1) % count];
            length = segmentLength(startPoint, endPoint) || 1;
            fromStart = wall.reversed ? length - from - span : from;
            directionX = (endPoint[0] - startPoint[0]) / length;
            directionY = (endPoint[1] - startPoint[1]) / length;
            normal = sideUnit(startPoint, endPoint, outward);
            begin = [startPoint[0] + directionX * fromStart, startPoint[1] + directionY * fromStart];
            finish = [startPoint[0] + directionX * (fromStart + span), startPoint[1] + directionY * (fromStart + span)];
            outerStart = [begin[0] + normal[0] * depth, begin[1] + normal[1] * depth];
            outerEnd = [finish[0] + normal[0] * depth, finish[1] + normal[1] * depth];
            if (stubAtStart) {
                mids.push(begin);
                ids.push(edgeIds[wall.index]);
            }
            mids.push(outerStart);
            ids.push(uid('e'));
            mids.push(outerEnd);
            ids.push(uid('e'));
            if (stubAtEnd) {
                mids.push(finish);
                ids.push(uid('e'));
            }
            ids.push(uid('e'));
            var previousOpenings = state.openings.map(function (opening) {
                return {
                    id: opening.id,
                    wall: opening.wall,
                    offset: opening.offset,
                    width: opening.width,
                    hinge: opening.hinge,
                    swing: opening.swing
                };
            });
            state.openings = state.openings.filter(function (opening) {
                var openingEnd;
                if (opening.wall !== wall.id) {
                    return true;
                }
                openingEnd = opening.offset + opening.width;
                if (stubAtStart && openingEnd <= from + 0.01) {
                    return true;
                }
                if (stubAtEnd && opening.offset >= from + span - 0.01) {
                    opening.wall = ids[ids.length - 1];
                    opening.offset = snap(opening.offset - from - span);
                    return true;
                }
                return false;
            });
            points.splice.apply(points, [wall.index + 1, 0].concat(mids));
            edgeIds.splice.apply(edgeIds, [wall.index, 1].concat(ids));
            if (!commitRoomPoints(points, edgeIds)) {
                state.openings = previousOpenings;
                return false;
            }
            setStatus(outward ? 'Added a wall that sticks out.' : 'Cut a notch into the wall.');
            return true;
        }

        function jogCapIndex(wall) {
            var points;
            var count;
            var index;
            var previous;
            var after;
            var legOut;
            var legBack;
            if (!wall || state.room.kind !== 'custom' || !state.room.points) {
                return -1;
            }
            points = state.room.points;
            count = points.length;
            index = wall.index;
            previous = (index + count - 1) % count;
            after = (index + 2) % count;
            legOut = segmentLength(points[previous], points[index]);
            legBack = segmentLength(points[(index + 1) % count], points[after]);
            if (Math.abs(legOut - legBack) > 0.05 || legOut < MIN_WALL - 0.001) {
                return -1;
            }
            if (!edgeAxis(points[index], points[(index + 1) % count]) || edgeAxis(points[index], points[(index + 1) % count]) !== edgeAxis(points[previous], points[after])) {
                return -1;
            }
            if (edgeAxis(points[previous], points[index]) === edgeAxis(points[index], points[(index + 1) % count])) {
                return -1;
            }
            return index;
        }

        function removeJog(wallId) {
            var wall = findWall(wallId);
            var index = jogCapIndex(wall);
            var points;
            var edgeIds;
            var drop;
            if (index < 0) {
                return false;
            }
            points = [];
            edgeIds = [];
            drop = {};
            drop[index] = true;
            drop[(index + 1) % state.room.points.length] = true;
            state.room.points.forEach(function (point, pointIndex) {
                if (!drop[pointIndex]) {
                    points.push([point[0], point[1]]);
                    edgeIds.push(state.room.edgeIds[pointIndex]);
                }
            });
            if (!commitRoomPoints(points, edgeIds)) {
                return false;
            }
            state.selected = null;
            renderSelection();
            setStatus('Removed the extra wall.');
            return true;
        }

        function setRoomSize(width, depth) {
            var before = state.items.length;
            var room = state.room;
            var nextWidth = Math.min(MAX_ROOM, Math.max(minRoomSize(), snap(width)));
            var nextDepth = Math.min(MAX_ROOM, Math.max(minRoomSize(), snap(depth)));
            var scaleX;
            var scaleY;
            var scaled;
            if (room.kind === 'custom') {
                if (!room.segments || !room.segments.length || room.width <= 0 || room.depth <= 0) {
                    syncSizeInputs();
                    setStatus('Close the walls into a room before resizing the whole plan.');
                    return;
                }
                var roomBounds = segmentBounds(room.segments);
                scaleX = nextWidth / room.width;
                scaleY = nextDepth / room.depth;
                scaled = cloneSegments(room.segments);
                scaled.forEach(function (segment) {
                    segment.x1 = snap(roomBounds.minX + (segment.x1 - roomBounds.minX) * scaleX);
                    segment.y1 = snap(roomBounds.minY + (segment.y1 - roomBounds.minY) * scaleY);
                    segment.x2 = snap(roomBounds.minX + (segment.x2 - roomBounds.minX) * scaleX);
                    segment.y2 = snap(roomBounds.minY + (segment.y2 - roomBounds.minY) * scaleY);
                    if (segment.bulge) {
                        segment.bulge = snap(segment.bulge * ((scaleX + scaleY) / 2));
                    }
                    if (Math.abs(segment.x2 - segment.x1) > 0.05 && Math.abs(segment.y2 - segment.y1) > 0.05) {
                        var component = Math.max(1, snap((Math.abs(segment.x2 - segment.x1) + Math.abs(segment.y2 - segment.y1)) / 2));
                        segment.x2 = snap(segment.x1 + (segment.x2 >= segment.x1 ? component : -component));
                        segment.y2 = snap(segment.y1 + (segment.y2 >= segment.y1 ? component : -component));
                    }
                    clampBulge(segment);
                });
                if (!segmentsOk(scaled)) {
                    syncSizeInputs();
                    setStatus('That size would break the walls.');
                    return;
                }
                room.segments = scaled;
                syncFromSegments(true);
                persist();
                renderPlan();
                renderSelection();
                if (state.items.length < before) {
                    setStatus('Some pieces no longer fit and were removed.');
                } else {
                    setStatus('');
                }
                return;
            }
            if (room.kind !== 'rect' && room.width > 0 && room.depth > 0) {
                room.cutW *= nextWidth / room.width;
                room.cutD *= nextDepth / room.depth;
            }
            room.width = nextWidth;
            room.depth = nextDepth;
            tightenRoom(room);
            if (room.kind === 'rect') {
                if (!(room.shape === 'studio' && room.width === 20 && room.depth === 14)) {
                    room.shape = room.width === room.depth ? 'square' : 'rectangle';
                }
            }
            normalizeOpenings();
            normalizeItems();
            dropMissingSelection();
            syncSizeInputs();
            syncShapeButtons();
            persist();
            renderPlan();
            renderSelection();
            if (state.items.length < before) {
                setStatus('Some pieces no longer fit and were removed.');
            } else {
                setStatus('');
            }
        }

        function polyCentroid(points) {
            var area = signedArea(points);
            var cx = 0;
            var cy = 0;
            var index;
            var next;
            var cross;
            if (!points.length) {
                return { x: 0, y: 0 };
            }
            if (Math.abs(area) < 0.001) {
                points.forEach(function (point) {
                    cx += point[0];
                    cy += point[1];
                });
                return { x: cx / points.length, y: cy / points.length };
            }
            for (index = 0; index < points.length; index += 1) {
                next = points[(index + 1) % points.length];
                cross = points[index][0] * next[1] - next[0] * points[index][1];
                cx += (points[index][0] + next[0]) * cross;
                cy += (points[index][1] + next[1]) * cross;
            }
            return { x: cx / (6 * area), y: cy / (6 * area) };
        }

        function wallOutward(wall) {
            var midX = (wall.x1 + wall.x2) / 2;
            var midY = (wall.y1 + wall.y2) / 2;
            var faces = layout().faces || [];
            function inside(x, y) {
                return faces.some(function (face) {
                    return pointInPoly(x, y, face);
                });
            }
            var before = wall.horizontal ? inside(midX, midY - 0.4) : inside(midX - 0.4, midY);
            var after = wall.horizontal ? inside(midX, midY + 0.4) : inside(midX + 0.4, midY);
            if (before === after) {
                return null;
            }
            if (wall.horizontal) {
                return { x: 0, y: before ? 1 : -1 };
            }
            return { x: before ? 1 : -1, y: 0 };
        }

        function nearestOutsideWall(x, y, reach) {
            var best = null;
            allWalls().forEach(function (wall) {
                var outward = wallOutward(wall);
                var offset;
                var clamped;
                var pointX;
                var pointY;
                var dist;
                if (!outward) {
                    return;
                }
                offset = project(wall, x, y);
                clamped = Math.max(0, Math.min(wall.length, offset));
                pointX = wall.horizontal ? wall.x1 + clamped : wall.x1;
                pointY = wall.horizontal ? wall.y1 : wall.y1 + clamped;
                dist = Math.hypot(x - pointX, y - pointY);
                if (reach && dist > reach) {
                    return;
                }
                if (!best || dist < best.dist) {
                    best = {
                        wall: wall,
                        dist: dist,
                        along: wall.horizontal ? pointX : pointY,
                        outward: outward
                    };
                }
            });
            return best;
        }

        function seatAlong(wallStart, wallEnd, length, along) {
            var desired = snap(along - length / 2);
            var limit = snap(wallEnd - length);
            var choices = [desired, wallStart, limit];
            var best = null;
            choices.forEach(function (candidate) {
                var start = Math.max(wallStart, Math.min(snap(candidate), limit));
                var lead = start - wallStart;
                var trail = wallEnd - (start + length);
                var score;
                if ((lead > 0.05 && lead < MIN_WALL - 0.001) || (trail > 0.05 && trail < MIN_WALL - 0.001)) {
                    return;
                }
                score = Math.abs((start + length / 2) - along);
                if (!best || score < best.score) {
                    best = { start: start, score: score };
                }
            });
            return best ? best.start : null;
        }

        function seatEdge(poly, edgeIndex, wall, along, outward) {
            var body = poly.map(function (point) {
                return [point[0], point[1]];
            });
            var a = body[edgeIndex];
            var b = body[(edgeIndex + 1) % body.length];
            var centroid = polyCentroid(body);
            var length = segmentLength(a, b);
            var dx = 0;
            var dy = 0;
            var start;
            var edgeMin;
            var transformed;
            var segments = [];
            var shared;
            var index;
            var point;
            var nextPoint;
            var segment;
            if (wall.horizontal) {
                if ((centroid.y - a[1]) * outward.y < 0) {
                    body = body.map(function (corner) {
                        return [corner[0], a[1] - (corner[1] - a[1])];
                    });
                    a = body[edgeIndex];
                    b = body[(edgeIndex + 1) % body.length];
                }
                edgeMin = Math.min(a[0], b[0]);
                start = seatAlong(wall.x1, wall.x2, length, along);
                if (start === null) {
                    return null;
                }
                dx = start - edgeMin;
                dy = wall.y1 - a[1];
                shared = { x1: start, y1: wall.y1, x2: snap(start + length), y2: wall.y1 };
            } else {
                if ((centroid.x - a[0]) * outward.x < 0) {
                    body = body.map(function (corner) {
                        return [a[0] - (corner[0] - a[0]), corner[1]];
                    });
                    a = body[edgeIndex];
                    b = body[(edgeIndex + 1) % body.length];
                }
                edgeMin = Math.min(a[1], b[1]);
                start = seatAlong(wall.y1, wall.y2, length, along);
                if (start === null) {
                    return null;
                }
                dy = start - edgeMin;
                dx = wall.x1 - a[0];
                shared = { x1: wall.x1, y1: start, x2: wall.x1, y2: snap(start + length) };
            }
            transformed = body.map(function (corner) {
                return [snap(corner[0] + dx), snap(corner[1] + dy)];
            });
            if (wall.horizontal) {
                transformed[edgeIndex] = [shared.x1, wall.y1];
                transformed[(edgeIndex + 1) % transformed.length] = [shared.x2, wall.y1];
            } else {
                transformed[edgeIndex] = [wall.x1, shared.y1];
                transformed[(edgeIndex + 1) % transformed.length] = [wall.x1, shared.y2];
            }
            for (index = 0; index < transformed.length; index += 1) {
                if (index === edgeIndex) {
                    continue;
                }
                point = transformed[index];
                nextPoint = transformed[(index + 1) % transformed.length];
                if (segmentLength(point, nextPoint) < MIN_WALL - 0.001) {
                    return null;
                }
                segment = { id: uid('w'), x1: point[0], y1: point[1], x2: nextPoint[0], y2: nextPoint[1] };
                orderSegment(segment);
                segments.push(segment);
            }
            return {
                segments: segments,
                shared: shared,
                points: transformed,
                edgeIndex: edgeIndex,
                center: wall.horizontal ? (shared.x1 + shared.x2) / 2 : (shared.y1 + shared.y2) / 2
            };
        }

        function fitPolyToWall(poly, wall, along, outward) {
            var options = [poly, poly.map(function (point) {
                return [point[1], -point[0]];
            })];
            var best = null;
            options.forEach(function (candidate) {
                candidate.forEach(function (point, index) {
                    var next = candidate[(index + 1) % candidate.length];
                    var axis = edgeAxis(point, next);
                    var length = segmentLength(point, next);
                    var placed;
                    if ((wall.horizontal && axis !== 'h') || (!wall.horizontal && axis !== 'v')) {
                        return;
                    }
                    if (length > wall.length + 0.05 || length < MIN_ROOM - 0.05) {
                        return;
                    }
                    placed = seatEdge(candidate, index, wall, along, outward);
                    if (!placed) {
                        return;
                    }
                    if (!best || Math.abs(placed.center - along) < Math.abs(best.center - along) - 0.05) {
                        best = placed;
                    }
                });
            });
            return best;
        }

        function polygonStaysOutside(points, sharedIndex, faces) {
            var centroid = polyCentroid(points);
            if (faces.some(function (face) {
                return pointInPoly(centroid.x, centroid.y, face);
            })) {
                return false;
            }
            return points.every(function (point, index) {
                if (index === sharedIndex || index === (sharedIndex + 1) % points.length) {
                    return true;
                }
                return !faces.some(function (face) {
                    return pointInPoly(point[0], point[1], face);
                });
            });
        }

        function proposalForWall(template, wall, along) {
            var outward;
            var poly;
            if (!template || template.id === 'custom') {
                return null;
            }
            outward = wallOutward(wall);
            if (!outward) {
                return null;
            }
            poly = shapePolygon(roomFromTemplate(template));
            if (poly.length < 4) {
                return null;
            }
            return fitPolyToWall(poly, wall, along, outward);
        }

        function showRoomPreview(points) {
            var group = svg.querySelector('.room-builder__room-preview');
            if (!points || points.length < 4) {
                clearRoomPreview();
                return;
            }
            if (!group) {
                group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('class', 'room-builder__room-preview');
                group.setAttribute('pointer-events', 'none');
                svg.appendChild(group);
            }
            group.innerHTML = '<polygon points="' + points.map(function (point) {
                return num(point[0]) + ',' + num(point[1]);
            }).join(' ') + '"></polygon>';
        }

        function clearRoomPreview() {
            var group = svg.querySelector('.room-builder__room-preview');
            if (group && group.parentNode) {
                group.parentNode.removeChild(group);
            }
        }

        function addSharedDoor(shared) {
            var host = null;
            var horizontal = Math.abs(shared.y1 - shared.y2) <= 0.001;
            var span;
            var width;
            var sharedStart;
            var offset;
            var opening;
            allWalls().forEach(function (wall) {
                if (wall.horizontal !== horizontal) {
                    return;
                }
                if (horizontal) {
                    if (Math.abs(wall.y1 - shared.y1) > 0.05 || shared.x1 < wall.x1 - 0.05 || shared.x2 > wall.x2 + 0.05) {
                        return;
                    }
                } else if (Math.abs(wall.x1 - shared.x1) > 0.05 || shared.y1 < wall.y1 - 0.05 || shared.y2 > wall.y2 + 0.05) {
                    return;
                }
                if (!host || wall.length < host.length) {
                    host = wall;
                }
            });
            if (!host) {
                return false;
            }
            span = horizontal ? shared.x2 - shared.x1 : shared.y2 - shared.y1;
            width = span >= DOOR_WIDTH + 1 ? DOOR_WIDTH : 0;
            if (!width) {
                return false;
            }
            sharedStart = horizontal ? shared.x1 - host.x1 : shared.y1 - host.y1;
            offset = snap(sharedStart + (span - width) / 2);
            offset = Math.max(0, Math.min(offset, host.length - width));
            if (overlapsOpening(host.id, offset, width, null)) {
                return false;
            }
            opening = {
                id: uid('d'),
                wall: host.id,
                offset: offset,
                width: width,
                hinge: 'start',
                swing: 'in',
                kind: 'door'
            };
            if (openingBlockedByFurniture(opening)) {
                return false;
            }
            state.openings.push(opening);
            return true;
        }

        function attachShape(template, wall, along) {
            var before = captureRoomState();
            var proposal = proposalForWall(template, wall, along);
            var next;
            var doorAdded;
            if (template.id === 'custom') {
                setStatus('Drag a rectangle, L, or T onto an outside wall to add a room.');
                return;
            }
            if (!wallOutward(wall)) {
                setStatus('Drop the room on an outside wall.');
                return;
            }
            if (!proposal) {
                setStatus('That room is longer than this wall.');
                return;
            }
            if (!polygonStaysOutside(proposal.points, proposal.edgeIndex, layout().faces || [])) {
                setStatus('That room would cover the house.');
                return;
            }
            ensureCustom();
            next = cloneSegments(state.room.segments).concat(proposal.segments);
            if (!segmentsOk(next)) {
                restoreRoomState(before);
                setStatus('That room would cross a wall.');
                return;
            }
            state.room.segments = next;
            syncFromSegments(true);
            doorAdded = addSharedDoor(proposal.shared);
            persist();
            renderPlan();
            renderSelection();
            renderLevels();
            setStatus(doorAdded ? 'Room added. A door joins it to the house.' : 'Room added. The shared wall is ready for a door.');
        }

        function trackButtonDrag() {
            stopTrackingButtonDrag();
            window.addEventListener('pointermove', relayButtonDrag, true);
            window.addEventListener('pointerup', finishButtonDrag, true);
        }

        function stopTrackingButtonDrag() {
            window.removeEventListener('pointermove', relayButtonDrag, true);
            window.removeEventListener('pointerup', finishButtonDrag, true);
        }

        function relayButtonDrag(event) {
            if (!drag || drag.pointerId !== event.pointerId) {
                return;
            }
            if (drag.kind === 'shape') {
                onShapePointerMove(event);
            } else if (drag.kind === 'wall-piece') {
                onWallPointerMove(event);
            } else if (drag.kind === 'palette') {
                onPalettePointerMove(event);
            } else if (drag.kind === 'custom-wall') {
                onCustomWallPointerMove(event);
            }
        }

        function finishButtonDrag(event) {
            var kind = drag && drag.kind;
            stopTrackingButtonDrag();
            if (!drag || drag.pointerId !== event.pointerId) {
                return;
            }
            if (kind === 'shape') {
                onShapePointerUp(event);
            } else if (kind === 'wall-piece') {
                onWallPointerUp(event);
            } else if (kind === 'palette') {
                onPalettePointerUp(event);
            } else if (kind === 'custom-wall') {
                onCustomWallPointerUp(event);
            }
        }

        function holdPointer(event) {
            trackButtonDrag();
            event.preventDefault();
            event.stopPropagation();
        }

        function onShapePointerDown(event, template) {
            if (event.button !== 0) {
                return;
            }
            drag = {
                kind: 'shape',
                template: template,
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                moved: false
            };
            holdPointer(event);
        }

        function onShapePointerMove(event) {
            var feet;
            var hit;
            var proposal;
            var bounds;
            if (!drag || drag.kind !== 'shape' || drag.pointerId !== event.pointerId) {
                return;
            }
            if (Math.abs(event.clientX - drag.startX) > 6 || Math.abs(event.clientY - drag.startY) > 6) {
                drag.moved = true;
                ensureGhost(drag.template.label, event.clientX, event.clientY);
            }
            if (!drag.moved) {
                return;
            }
            bounds = stage.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
                clearRoomPreview();
                return;
            }
            feet = clientToFeet(event.clientX, event.clientY);
            hit = nearestOutsideWall(feet.x, feet.y);
            proposal = hit ? proposalForWall(drag.template, hit.wall, hit.along) : null;
            showRoomPreview(proposal ? proposal.points : null);
        }

        function onShapePointerUp(event) {
            var current;
            var feet;
            var hit;
            var bounds;
            if (!drag || drag.kind !== 'shape' || drag.pointerId !== event.pointerId) {
                return;
            }
            current = drag;
            drag = null;
            removeGhost();
            clearRoomPreview();
            if (!current.moved) {
                applyShape(current.template);
                return;
            }
            if (current.template.id === 'custom') {
                setStatus('Drag a rectangle, L, or T onto an outside wall to add a room.');
                return;
            }
            bounds = stage.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
                setStatus('Drop the room on an outside wall.');
                return;
            }
            feet = clientToFeet(event.clientX, event.clientY);
            hit = nearestOutsideWall(feet.x, feet.y);
            if (!hit) {
                setStatus('Drop the room on the plan.');
                return;
            }
            attachShape(current.template, hit.wall, hit.along);
        }

        function applyShape(template) {
            var before = state.items.length;
            var hadDoors = state.openings.length > 0;
            if (template.id === 'custom') {
                ensureCustom();
                syncSizeInputs();
                syncShapeButtons();
                persist();
                renderPlan();
                renderSelection();
                setStatus('Drag a 2 ft or 6 ft wall onto the plan. Drop its ends on corners to change the room.');
                return;
            }
            state.room = roomFromTemplate(template);
            tightenRoom(state.room);
            state.openings = [];
            state.selected = null;
            normalizeItems();
            dropMissingSelection();
            syncSizeInputs();
            syncShapeButtons();
            persist();
            renderPlan();
            renderSelection();
            var messages = [];
            if (hadDoors) {
                messages.push('Doorways were cleared for the new shape.');
            }
            if (state.items.length < before) {
                messages.push('Some pieces no longer fit and were removed.');
            }
            setStatus(messages.join(' '));
        }

        function syncSizeInputs() {
            var minSize = String(minRoomSize());
            widthInput.min = minSize;
            depthInput.min = minSize;
            widthInput.value = String(state.room.width);
            depthInput.value = String(state.room.depth);
        }

        function movablePiece(entry) {
            if (!entry) {
                return false;
            }
            if (entry.type === 'item') {
                return !!findItem(entry.id);
            }
            if (entry.type === 'stair') {
                return !!findStair(entry.id);
            }
            return false;
        }

        function pickedList() {
            var list = Array.isArray(state.group) ? state.group.slice() : [];
            if (state.selected && movablePiece(state.selected) && !list.some(function (entry) {
                return entry.id === state.selected.id;
            })) {
                list.push({ type: state.selected.type, id: state.selected.id });
            }
            return list.filter(movablePiece);
        }

        function isPicked(id) {
            return pickedList().some(function (entry) {
                return entry.id === id;
            });
        }

        function selectOnly(type, id) {
            state.selected = { type: type, id: id };
            state.group = type === 'item' || type === 'stair' ? [{ type: type, id: id }] : [];
        }

        function clearPicks() {
            state.selected = null;
            state.group = [];
        }

        function togglePick(type, id) {
            var list = pickedList();
            var index = -1;
            if (type !== 'item' && type !== 'stair') {
                selectOnly(type, id);
                return;
            }
            list.forEach(function (entry, entryIndex) {
                if (entry.id === id) {
                    index = entryIndex;
                }
            });
            if (index >= 0) {
                list.splice(index, 1);
            } else {
                list.push({ type: type, id: id });
            }
            state.group = list;
            state.selected = list.length ? { type: list[list.length - 1].type, id: list[list.length - 1].id } : null;
        }

        function dropPick(id) {
            state.group = pickedList().filter(function (entry) {
                return entry.id !== id;
            });
            if (!state.selected || state.selected.id === id) {
                state.selected = state.group.length ? { type: state.group[state.group.length - 1].type, id: state.group[state.group.length - 1].id } : null;
            }
        }

        function additivePointer(event) {
            return !!(event.shiftKey || event.ctrlKey || event.metaKey);
        }

        function dropMissingSelection() {
            state.group = pickedList();
            if (!state.selected) {
                return;
            }
            if (state.selected.type === 'item' && !findItem(state.selected.id)) {
                dropPick(state.selected.id);
            }
            if (state.selected && state.selected.type === 'wall' && !findWall(state.selected.id)) {
                clearPicks();
            }
            if (state.selected && state.selected.type === 'stair' && !findStair(state.selected.id)) {
                dropPick(state.selected.id);
            }
        }

        function syncShapeButtons() {
            app.querySelectorAll('[data-shape]').forEach(function (button) {
                button.classList.toggle('is-active', button.getAttribute('data-shape') === state.room.shape);
            });
        }

        function chooseOpeningTool(tool) {
            state.tool = state.tool === tool ? 'select' : tool;
            syncDoorTool();
            if (state.tool === 'door') {
                setStatus('Click a wall to add a door.');
            } else if (state.tool === 'doorway') {
                setStatus('Click a wall to add a doorway.');
            } else if (state.tool === 'window') {
                setStatus('Click a wall to add a window.');
            } else {
                setStatus('');
            }
        }

        function syncDoorTool() {
            var door = state.tool === 'door';
            var doorway = state.tool === 'doorway';
            var windowTool = state.tool === 'window';
            var stair = state.tool === 'stair';
            var stairDown = state.tool === 'stair-down';
            var wall = state.tool === 'wall';
            doorButton.classList.toggle('is-active', door);
            doorButton.setAttribute('aria-pressed', door ? 'true' : 'false');
            if (doorwayButton) {
                doorwayButton.classList.toggle('is-active', doorway);
                doorwayButton.setAttribute('aria-pressed', doorway ? 'true' : 'false');
            }
            if (windowButton) {
                windowButton.classList.toggle('is-active', windowTool);
                windowButton.setAttribute('aria-pressed', windowTool ? 'true' : 'false');
            }
            if (stairButton) {
                stairButton.classList.toggle('is-active', stair);
                stairButton.setAttribute('aria-pressed', stair ? 'true' : 'false');
            }
            if (stairDownButton) {
                stairDownButton.classList.toggle('is-active', stairDown);
                stairDownButton.setAttribute('aria-pressed', stairDown ? 'true' : 'false');
            }
            if (customWallButton) {
                customWallButton.classList.toggle('is-active', wall);
                customWallButton.setAttribute('aria-pressed', wall ? 'true' : 'false');
            }
            if (wallNote) {
                wallNote.hidden = !wall;
            }
            stage.classList.toggle('is-door-tool', door || doorway || windowTool);
            stage.classList.toggle('is-stair-tool', stair || stairDown);
            stage.classList.toggle('is-wall-tool', wall);
        }

        function setStatus(message) {
            statusEl.hidden = !message;
            statusEl.textContent = message || '';
            hintEl.hidden = !!message || state.tool === 'wall';
        }

        function resetPlan() {
            var message = account.user && state.planId
                ? 'Start a new house on the screen? The copy in My Plans stays saved.'
                : 'Clear this house plan?';
            var fresh;
            if (!window.confirm(message)) {
                return;
            }
            window.clearTimeout(account.timer);
            fresh = blankState();
            state.version = 3;
            state.levels = fresh.levels;
            state.activeLevelId = fresh.activeLevelId;
            state.room = fresh.room;
            state.openings = [];
            state.items = [];
            state.stairs = [];
            state.catalog = 'living';
            state.selected = null;
            state.group = [];
            state.tool = 'select';
            state.planId = 0;
            state.planTitle = '';
            state.dirty = false;
            viewZoom = 1;
            viewOrigin = null;
            syncDoorTool();
            syncSizeInputs();
            syncShapeButtons();
            persist({ remote: false, clean: true });
            renderPalette();
            renderPlan();
            renderSelection();
            renderLevels();
            accountStatus('');
            renderAccount();
            setStatus('');
        }

        function earthTextureUrl() {
            var cfg = window.roomBuilderAccount || {};
            var script;
            if (cfg.earthUrl) {
                return cfg.earthUrl;
            }
            script = document.querySelector('script[src*="room-builder.js"]');
            if (script && script.src) {
                return script.src.replace(/assets\/js\/room-builder\.js(?:\?.*)?$/, 'assets/images/basement-earth.png');
            }
            return 'assets/images/basement-earth.png';
        }

        function syncLevelScene() {
            if (!stage) {
                return;
            }
            stage.classList.toggle('is-basement', state.activeLevelId === 'basement');
            stage.classList.toggle('is-second', state.activeLevelId === 'second');
            if (!stage.style.getPropertyValue('--earth')) {
                stage.style.setProperty('--earth', 'url("' + earthTextureUrl() + '")');
            }
        }

        function levelOverlayPolygons() {
            var source;
            var origin;
            if (state.activeLevelId !== 'second' && state.activeLevelId !== 'basement') {
                return [];
            }
            source = findLevel('first');
            if (!source || !source.room) {
                return [];
            }
            origin = roomOrigin(state.room);
            return roomFaces(source.room).map(function (face) {
                return face.map(function (point) {
                    return [point[0] - origin.x, point[1] - origin.y];
                });
            });
        }

        function levelOverlayPoints() {
            var points = [];
            levelOverlayPolygons().forEach(function (face) {
                face.forEach(function (point) {
                    points.push(point);
                });
            });
            return points;
        }

        function overlayMarkup() {
            var faces = levelOverlayPolygons();
            var kind = state.activeLevelId === 'basement' ? 'room-builder__roof room-builder__roof--slab' : 'room-builder__roof';
            return faces.map(function (face) {
                var coords = face.map(function (point) {
                    return num(point[0]) + ',' + num(point[1]);
                }).join(' ');
                return '<polygon class="' + kind + '" points="' + coords + '" filter="url(#' + clipId + '-soft)" pointer-events="none"></polygon>';
            }).join('');
        }

        var VIEW_CEILING = 8;

        function toggleView3d(force) {
            view3dOn = typeof force === 'boolean' ? force : !view3dOn;
            stage.classList.toggle('is-3d', view3dOn);
            view3dButton.textContent = view3dOn ? 'Plan' : '3D';
            view3dButton.classList.toggle('is-active', view3dOn);
            view3dButton.setAttribute('aria-pressed', view3dOn ? 'true' : 'false');
            view3dButton.title = view3dOn ? 'Return to the flat plan' : 'Look around this floor in 3D';
            if (view3dOn) {
                var span = Math.max(state.room.spanW || state.room.width || 12, state.room.spanD || state.room.depth || 14);
                orbit.yaw = -0.75;
                orbit.pitch = 0.95;
                orbit.dist = Math.max(16, Math.min(90, span * 1.65));
                setStatus('Drag to look around this floor. Scroll to zoom. Plan brings back the drawing view.');
                renderView3d();
            } else {
                setStatus('');
            }
        }

        function onView3dDown(event) {
            if (!view3dOn || event.button !== 0) {
                return;
            }
            orbitDrag = { id: event.pointerId, x: event.clientX, y: event.clientY };
            if (view3d.setPointerCapture) {
                view3d.setPointerCapture(event.pointerId);
            }
        }

        function onView3dMove(event) {
            if (!orbitDrag || orbitDrag.id !== event.pointerId) {
                return;
            }
            orbit.yaw -= (event.clientX - orbitDrag.x) * 0.008;
            orbit.pitch = Math.max(0.2, Math.min(1.2, orbit.pitch + (event.clientY - orbitDrag.y) * 0.005));
            orbitDrag.x = event.clientX;
            orbitDrag.y = event.clientY;
            renderView3d();
        }

        function onView3dUp(event) {
            if (!orbitDrag || orbitDrag.id !== event.pointerId) {
                return;
            }
            orbitDrag = null;
        }

        function onView3dWheel(event) {
            if (!view3dOn) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            orbit.dist = Math.max(8, Math.min(120, orbit.dist * (event.deltaY > 0 ? 1.08 : 0.92)));
            renderView3d();
        }

        function mapPlanPoint(originX, originZ, rotation, width, depth, boxW, boxD, localX, localZ) {
            var rad = ((Number(rotation) || 0) * Math.PI) / 180;
            var cosine = Math.cos(rad);
            var sine = Math.sin(rad);
            var dx = localX - width / 2;
            var dz = localZ - depth / 2;
            var cx = originX + boxW / 2;
            var cz = originZ + boxD / 2;
            return {
                x: cx + dx * cosine - dz * sine,
                z: cz + dx * sine + dz * cosine
            };
        }

        function pushQuad(tris, p0, p1, p2, p3, color) {
            tris.push({ a: p0, b: p1, c: p2, color: color });
            tris.push({ a: p0, b: p2, c: p3, color: color });
        }

        function pushUpright(tris, a, b, c, d, y0, y1, color) {
            function at(point, y) {
                return { x: point.x, y: y, z: point.z };
            }
            pushQuad(tris, at(a, y1), at(d, y1), at(c, y1), at(b, y1), color);
            pushQuad(tris, at(a, y0), at(a, y1), at(b, y1), at(b, y0), color);
            pushQuad(tris, at(b, y0), at(b, y1), at(c, y1), at(c, y0), color);
            pushQuad(tris, at(c, y0), at(c, y1), at(d, y1), at(d, y0), color);
            pushQuad(tris, at(d, y0), at(d, y1), at(a, y1), at(a, y0), color);
        }

        function addRibbon(tris, points, y0, y1, color, half) {
            var index;
            var dx;
            var dz;
            var len;
            var nx;
            var nz;
            var a;
            var b;
            var c;
            var d;
            half = half || 0.16;
            for (index = 0; index < points.length - 1; index += 1) {
                dx = points[index + 1].x - points[index].x;
                dz = points[index + 1].y - points[index].y;
                len = Math.hypot(dx, dz) || 1;
                nx = -dz / len * half;
                nz = dx / len * half;
                a = { x: points[index].x + nx, z: points[index].y + nz };
                b = { x: points[index + 1].x + nx, z: points[index + 1].y + nz };
                c = { x: points[index + 1].x - nx, z: points[index + 1].y - nz };
                d = { x: points[index].x - nx, z: points[index].y - nz };
                pushUpright(tris, a, b, c, d, y0, y1, color);
            }
        }

        function spanPoints(wall, d0, d1) {
            var steps = Math.abs(wall.bulge || 0) > 0.05 ? 6 : 1;
            var points = [];
            var index;
            var point;
            for (index = 0; index <= steps; index += 1) {
                point = pointAlongWall(wall, d0 + (d1 - d0) * (index / steps));
                points.push(point);
            }
            return points;
        }

        function addWallSpans(tris, wall) {
            var openings = (state.openings || []).filter(function (opening) {
                return opening.wall === wall.id;
            }).sort(function (a, b) {
                return a.offset - b.offset;
            });
            var spans = [];
            var cursor = 0;
            openings.forEach(function (opening) {
                var start = Math.max(0, opening.offset);
                var end = Math.min(wall.length, opening.offset + opening.width);
                var kind = opening.kind || 'door';
                if (end - start < 0.2) {
                    return;
                }
                if (start - cursor > 0.12) {
                    spans.push({ d0: cursor, d1: start, kind: 'solid' });
                }
                spans.push({ d0: start, d1: end, kind: kind });
                cursor = Math.max(cursor, end);
            });
            if (wall.length - cursor > 0.12) {
                spans.push({ d0: cursor, d1: wall.length, kind: 'solid' });
            }
            if (!spans.length) {
                spans.push({ d0: 0, d1: wall.length, kind: 'solid' });
            }
            spans.forEach(function (span) {
                var points = spanPoints(wall, span.d0, span.d1);
                if (span.kind === 'window') {
                    addRibbon(tris, points, 0, 3, '#f4f0e8');
                    addRibbon(tris, points, 6.5, VIEW_CEILING, '#f4f0e8');
                    addRibbon(tris, points, 3, 6.5, '#b7d4e4', 0.05);
                } else if (span.kind === 'door' || span.kind === 'doorway') {
                    addRibbon(tris, points, 6.8, VIEW_CEILING, '#f4f0e8');
                } else {
                    addRibbon(tris, points, 0, VIEW_CEILING, '#f7f4ef');
                }
            });
        }

        function stairClimbsFromHere(stair) {
            if (stairGoesDown(stair)) {
                return state.activeLevelId === 'basement';
            }
            return state.activeLevelId !== 'second';
        }

        function floorOpenings() {
            var holes = [];
            (state.stairs || []).forEach(function (stair) {
                var box;
                if (stairClimbsFromHere(stair)) {
                    return;
                }
                box = stairBox(stair);
                holes.push({
                    x: stair.x - 0.04,
                    z: stair.y - 0.04,
                    w: box.w + 0.08,
                    d: box.d + 0.08
                });
            });
            return holes;
        }

        function subtractFloorRect(rect, hole) {
            var x1 = Math.max(rect.x, hole.x);
            var z1 = Math.max(rect.z, hole.z);
            var x2 = Math.min(rect.x + rect.w, hole.x + hole.w);
            var z2 = Math.min(rect.z + rect.d, hole.z + hole.d);
            var pieces = [];
            if (x2 - x1 <= 0.02 || z2 - z1 <= 0.02) {
                return [rect];
            }
            if (x1 - rect.x > 0.02) {
                pieces.push({ x: rect.x, z: rect.z, w: x1 - rect.x, d: rect.d });
            }
            if (rect.x + rect.w - x2 > 0.02) {
                pieces.push({ x: x2, z: rect.z, w: rect.x + rect.w - x2, d: rect.d });
            }
            if (z1 - rect.z > 0.02) {
                pieces.push({ x: x1, z: rect.z, w: x2 - x1, d: z1 - rect.z });
            }
            if (rect.z + rect.d - z2 > 0.02) {
                pieces.push({ x: x1, z: z2, w: x2 - x1, d: rect.z + rect.d - z2 });
            }
            return pieces;
        }

        function addFloorGrid(tris, face) {
            var minX = Infinity;
            var minZ = Infinity;
            var maxX = -Infinity;
            var maxZ = -Infinity;
            var holes = floorOpenings();
            var step;
            var x;
            var z;
            face.forEach(function (point) {
                minX = Math.min(minX, point[0]);
                minZ = Math.min(minZ, point[1]);
                maxX = Math.max(maxX, point[0]);
                maxZ = Math.max(maxZ, point[1]);
            });
            step = Math.max(1, Math.max(maxX - minX, maxZ - minZ) / 36);
            for (z = minZ; z < maxZ - 0.01; z += step) {
                for (x = minX; x < maxX - 0.01; x += step) {
                    var rects;
                    if (!pointInPoly(Math.min(x + step / 2, maxX), Math.min(z + step / 2, maxZ), face)) {
                        continue;
                    }
                    rects = [{
                        x: x,
                        z: z,
                        w: Math.min(x + step, maxX) - x,
                        d: Math.min(z + step, maxZ) - z
                    }];
                    holes.forEach(function (hole) {
                        var next = [];
                        rects.forEach(function (rect) {
                            subtractFloorRect(rect, hole).forEach(function (piece) {
                                next.push(piece);
                            });
                        });
                        rects = next;
                    });
                    rects.forEach(function (rect) {
                        pushQuad(tris, { x: rect.x, y: 0, z: rect.z }, { x: rect.x + rect.w, y: 0, z: rect.z }, { x: rect.x + rect.w, y: 0, z: rect.z + rect.d }, { x: rect.x, y: 0, z: rect.z + rect.d }, '#d9c3a4');
                    });
                }
            }
        }

        function addPieceBox(tris, originX, originZ, rotation, width, depth, boxW, boxD, lx, lz, lw, ld, y0, y1, color) {
            var a = mapPlanPoint(originX, originZ, rotation, width, depth, boxW, boxD, lx, lz);
            var b = mapPlanPoint(originX, originZ, rotation, width, depth, boxW, boxD, lx + lw, lz);
            var c = mapPlanPoint(originX, originZ, rotation, width, depth, boxW, boxD, lx + lw, lz + ld);
            var d = mapPlanPoint(originX, originZ, rotation, width, depth, boxW, boxD, lx, lz + ld);
            pushUpright(tris, a, b, c, d, y0, y1, color);
        }

        function buildView3dTriangles() {
            var tris = [];
            var plan = layout();
            var faces = (plan.faces || []).filter(function (face) {
                return face && face.length >= 3;
            });
            if (!faces.length && plan.polygon.length >= 4) {
                faces = [plan.polygon];
            }
            faces.forEach(function (face) {
                addFloorGrid(tris, face);
            });
            allWalls().forEach(function (wall) {
                if (wall.length < 0.2) {
                    return;
                }
                addWallSpans(tris, wall);
            });
            (state.items || []).forEach(function (item) {
                var entry = catalogItem(item.catalogId);
                var size;
                var box;
                var drawn;
                var base;
                var top;
                if (!entry) {
                    return;
                }
                size = placedSize(item);
                box = footprint(item);
                drawn = drawingEntry(item);
                base = Number(entry.base) || 0;
                top = base + placedHeight(item);
                localParts(drawn, size.width, size.depth).forEach(function (part) {
                    addPieceBox(tris, item.x, item.y, item.rotation, size.width, size.depth, box.w, box.d, part.x, part.y, part.w, part.d, base, top, entry.color || '#c4b4a2');
                });
            });
            (state.stairs || []).forEach(function (stair) {
                var box = stairBox(stair);
                var climbs = stairClimbsFromHere(stair);
                var drop = VIEW_CEILING * 0.92;
                var count = 8;
                var index;
                var y0;
                var y1;
                for (index = 0; index < count; index += 1) {
                    if (climbs) {
                        y0 = 0;
                        y1 = drop * ((index + 1) / count);
                    } else {
                        y0 = -drop * (index / count);
                        y1 = -drop * ((index + 1) / count);
                    }
                    addPieceBox(tris, stair.x, stair.y, stair.rotation, STAIR_W, STAIR_D, box.w, box.d, 0, STAIR_D * index / count, STAIR_W, STAIR_D / count, Math.min(y0, y1), Math.max(y0, y1), climbs ? '#e4d3b8' : '#6d5c4e');
                }
            });
            return tris;
        }

        function renderView3d() {
            var rect;
            var ratio;
            var ctx;
            var width;
            var height;
            var tris;
            var minX = Infinity;
            var minZ = Infinity;
            var maxX = -Infinity;
            var maxZ = -Infinity;
            var target;
            var eye;
            var forward;
            var right;
            var up;
            var focal;
            var lightX = 0.25;
            var lightY = 0.86;
            var lightZ = 0.2;
            var lightLen = Math.hypot(lightX, lightY, lightZ);
            if (!view3dOn || !view3d) {
                return;
            }
            rect = view3d.getBoundingClientRect();
            if (rect.width < 4 || rect.height < 4) {
                return;
            }
            ratio = window.devicePixelRatio || 1;
            if (view3d.width !== Math.round(rect.width * ratio) || view3d.height !== Math.round(rect.height * ratio)) {
                view3d.width = Math.round(rect.width * ratio);
                view3d.height = Math.round(rect.height * ratio);
            }
            ctx = view3d.getContext('2d');
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            width = rect.width;
            height = rect.height;
            ctx.fillStyle = state.activeLevelId === 'basement' ? '#171411' : '#d7ebe4';
            ctx.fillRect(0, 0, width, height);
            tris = buildView3dTriangles();
            (layout().faces || []).forEach(function (face) {
                (face || []).forEach(function (point) {
                    minX = Math.min(minX, point[0]);
                    minZ = Math.min(minZ, point[1]);
                    maxX = Math.max(maxX, point[0]);
                    maxZ = Math.max(maxZ, point[1]);
                });
            });
            if (!isFinite(minX)) {
                minX = 0;
                minZ = 0;
                maxX = state.room.width || 12;
                maxZ = state.room.depth || 14;
            }
            target = { x: (minX + maxX) / 2, y: 3, z: (minZ + maxZ) / 2 };
            eye = {
                x: target.x + orbit.dist * Math.cos(orbit.pitch) * Math.sin(orbit.yaw),
                y: target.y + orbit.dist * Math.sin(orbit.pitch),
                z: target.z + orbit.dist * Math.cos(orbit.pitch) * Math.cos(orbit.yaw)
            };
            forward = {
                x: target.x - eye.x,
                y: target.y - eye.y,
                z: target.z - eye.z
            };
            lightLen = Math.hypot(forward.x, forward.y, forward.z) || 1;
            forward.x /= lightLen;
            forward.y /= lightLen;
            forward.z /= lightLen;
            right = {
                x: forward.y * 0 - forward.z * 1,
                y: forward.z * 0 - forward.x * 0,
                z: forward.x * 1 - forward.y * 0
            };
            lightLen = Math.hypot(right.x, right.y, right.z) || 1;
            right.x /= lightLen;
            right.y /= lightLen;
            right.z /= lightLen;
            up = {
                x: right.y * forward.z - right.z * forward.y,
                y: right.z * forward.x - right.x * forward.z,
                z: right.x * forward.y - right.y * forward.x
            };
            focal = height * 0.95;
            function project(point) {
                var rx = point.x - eye.x;
                var ry = point.y - eye.y;
                var rz = point.z - eye.z;
                var camX = rx * right.x + ry * right.y + rz * right.z;
                var camY = rx * up.x + ry * up.y + rz * up.z;
                var camZ = rx * forward.x + ry * forward.y + rz * forward.z;
                if (camZ < 0.25) {
                    return null;
                }
                return {
                    x: width / 2 + camX * focal / camZ,
                    y: height / 2 - camY * focal / camZ,
                    z: camZ
                };
            }
            function shadeColor(color, amount) {
                var hex = String(color || '#c4b4a2').replace('#', '');
                var channels;
                if (hex.length < 6) {
                    return color;
                }
                channels = [0, 2, 4].map(function (start) {
                    return Math.max(0, Math.min(255, Math.round(parseInt(hex.substr(start, 2), 16) * amount)));
                });
                return 'rgb(' + channels.join(',') + ')';
            }
            lightX /= Math.hypot(0.25, 0.86, 0.2);
            lightY /= Math.hypot(0.25, 0.86, 0.2);
            lightZ /= Math.hypot(0.25, 0.86, 0.2);
            tris.map(function (triangle) {
                var pa = project(triangle.a);
                var pb = project(triangle.b);
                var pc = project(triangle.c);
                var ux;
                var uy;
                var uz;
                var vx;
                var vy;
                var vz;
                var nx;
                var ny;
                var nz;
                var len;
                var shade;
                if (!pa || !pb || !pc) {
                    return null;
                }
                ux = triangle.b.x - triangle.a.x;
                uy = triangle.b.y - triangle.a.y;
                uz = triangle.b.z - triangle.a.z;
                vx = triangle.c.x - triangle.a.x;
                vy = triangle.c.y - triangle.a.y;
                vz = triangle.c.z - triangle.a.z;
                nx = uy * vz - uz * vy;
                ny = uz * vx - ux * vz;
                nz = ux * vy - uy * vx;
                len = Math.hypot(nx, ny, nz) || 1;
                shade = 0.78 + 0.22 * Math.abs((nx * lightX + ny * lightY + nz * lightZ) / len);
                return {
                    depth: (pa.z + pb.z + pc.z) / 3,
                    color: shadeColor(triangle.color, shade),
                    points: [pa, pb, pc]
                };
            }).filter(function (face) {
                return !!face;
            }).sort(function (a, b) {
                return b.depth - a.depth;
            }).forEach(function (face) {
                ctx.beginPath();
                ctx.moveTo(face.points[0].x, face.points[0].y);
                ctx.lineTo(face.points[1].x, face.points[1].y);
                ctx.lineTo(face.points[2].x, face.points[2].y);
                ctx.closePath();
                ctx.fillStyle = face.color;
                ctx.fill();
            });
        }

        function renderPlan() {
            var plan = layout();
            var faces = (plan.faces || []).filter(function (face) {
                return face && face.length >= 4;
            });
            var walls = allWalls();
            var title = planTitleText();
            var markup = '';
            var clip = '';

            if (!faces.length && plan.polygon.length >= 4) {
                faces = [plan.polygon];
            }
            syncLevelScene();
            if (faces.length) {
                faces.forEach(function (face) {
                    var coords = face.map(function (point) {
                        return num(point[0]) + ',' + num(point[1]);
                    }).join(' ');
                    clip += '<polygon points="' + coords + '"></polygon>';
                });
                markup = '<defs><clipPath id="' + clipId + '">' + clip + '</clipPath>';
                markup += '<filter id="' + clipId + '-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="0.12"></feGaussianBlur></filter></defs>';
                markup += overlayMarkup();
                faces.forEach(function (face) {
                    markup += '<polygon class="room-builder__floor" data-kind="floor" points="' + face.map(function (point) {
                        return num(point[0]) + ',' + num(point[1]);
                    }).join(' ') + '"></polygon>';
                });
                markup += '<g class="room-builder__grid" clip-path="url(#' + clipId + ')" pointer-events="none">' + gridMarkup() + '</g>';
            }
            markup += stairsMarkup();
            markup += itemsMarkup(true);
            markup += wallsMarkup(walls);
            markup += wallHitMarkup(walls);
            markup += itemsMarkup(false);
            markup += openingsMarkup();
            markup += selectionMarkup();
            markup += wallLabelMarkup(walls);
            markup += wallHandleMarkup();
            markup += rotateHandleMarkup();
            markup += deleteHandleMarkup();
            markup += '<text pointer-events="none" text-anchor="start" font-size="0.42" x="0" y="-1.75">' + title + '</text>';
            svg.innerHTML = markup;
            writeViewBox();
            if (view3dOn) {
                renderView3d();
            }
        }

        function fittedViewBox() {
            var room = state.room;
            var padX = 2.3;
            var padTop = 2.35;
            var padBottom = 1.25;
            var spanWidth = Math.max(room.spanW || room.width || 0, 12);
            var spanDepth = Math.max(room.spanD || room.depth || 0, 8);
            var minX = 0;
            var minY = 0;
            var maxX = spanWidth;
            var maxY = spanDepth;
            function include(points) {
                (points || []).forEach(function (point) {
                    minX = Math.min(minX, point[0]);
                    minY = Math.min(minY, point[1]);
                    maxX = Math.max(maxX, point[0]);
                    maxY = Math.max(maxY, point[1]);
                });
            }
            (layout().faces || []).forEach(include);
            include(levelOverlayPoints());
            return {
                x: minX - padX,
                y: minY - padTop,
                w: (maxX - minX) + padX * 2,
                h: (maxY - minY) + padTop + padBottom
            };
        }

        function fittedViewString() {
            var box = fittedViewBox();
            return [box.x, box.y, box.w, box.h].join(' ');
        }

        function viewFrame() {
            var fitted = fittedViewBox();
            var width = fitted.w / viewZoom;
            var height = fitted.h / viewZoom;
            return {
                fitted: fitted,
                w: width,
                h: height,
                x: viewOrigin ? viewOrigin.x : fitted.x + (fitted.w - width) / 2,
                y: viewOrigin ? viewOrigin.y : fitted.y + (fitted.h - height) / 2
            };
        }

        function writeViewBox() {
            var frame = viewFrame();
            svg.setAttribute('viewBox', [frame.x, frame.y, frame.w, frame.h].join(' '));
            if (isFullscreen(root)) {
                svg.style.aspectRatio = '';
            } else {
                svg.style.aspectRatio = frame.fitted.w + ' / ' + frame.fitted.h;
            }
        }

        function panFrom(originX, originY, clientDx, clientDy) {
            var frame = viewFrame();
            var bounds = svg.getBoundingClientRect();
            var x;
            var y;
            if (!bounds.width || !bounds.height) {
                return;
            }
            x = originX - clientDx * (frame.w / bounds.width);
            y = originY - clientDy * (frame.h / bounds.height);
            x = Math.max(frame.fitted.x - frame.w + 2, Math.min(frame.fitted.x + frame.fitted.w - 2, x));
            y = Math.max(frame.fitted.y - frame.h + 2, Math.min(frame.fitted.y + frame.fitted.h - 2, y));
            viewOrigin = { x: x, y: y };
            writeViewBox();
        }

        function beginPan(event, fromPlan) {
            var frame = viewFrame();
            drag = {
                kind: 'pan',
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                originX: frame.x,
                originY: frame.y,
                fromPlan: fromPlan,
                moved: false
            };
            try {
                (fromPlan ? svg : stage).setPointerCapture(event.pointerId);
            } catch (error) {
                return;
            }
            event.preventDefault();
        }

        function movePan(event) {
            if (Math.abs(event.clientX - drag.startX) > 3 || Math.abs(event.clientY - drag.startY) > 3) {
                drag.moved = true;
                stage.classList.add('is-panning');
            }
            panFrom(drag.originX, drag.originY, event.clientX - drag.startX, event.clientY - drag.startY);
        }

        function endPan(current) {
            stage.classList.remove('is-panning');
            if (current.fromPlan && !current.moved) {
                clearPicks();
                renderSelection();
                renderPlan();
            }
        }

        function onStagePointerDown(event) {
            if (event.button !== 0 || event.target !== stage) {
                return;
            }
            if (state.tool !== 'select' || additivePointer(event)) {
                return;
            }
            beginPan(event, false);
        }

        function onStagePointerMove(event) {
            if (!drag || drag.kind !== 'pan' || drag.fromPlan || drag.pointerId !== event.pointerId) {
                return;
            }
            movePan(event);
        }

        function onStagePointerUp(event) {
            var current;
            if (!drag || drag.kind !== 'pan' || drag.fromPlan || drag.pointerId !== event.pointerId) {
                return;
            }
            current = drag;
            drag = null;
            endPan(current);
        }

        function onPlanWheel(event) {
            var bounds = stage.getBoundingClientRect();
            var svgBounds;
            var fitted;
            var oldWidth;
            var oldHeight;
            var originX;
            var originY;
            var rx;
            var ry;
            var focusX;
            var focusY;
            var delta;
            var nextZoom;
            var newWidth;
            var newHeight;
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom || view3dOn) {
                return;
            }
            event.preventDefault();
            svgBounds = svg.getBoundingClientRect();
            if (!svgBounds.width || !svgBounds.height) {
                return;
            }
            fitted = fittedViewBox();
            oldWidth = fitted.w / viewZoom;
            oldHeight = fitted.h / viewZoom;
            originX = viewOrigin ? viewOrigin.x : fitted.x + (fitted.w - oldWidth) / 2;
            originY = viewOrigin ? viewOrigin.y : fitted.y + (fitted.h - oldHeight) / 2;
            rx = (event.clientX - svgBounds.left) / svgBounds.width;
            ry = (event.clientY - svgBounds.top) / svgBounds.height;
            rx = Math.max(0, Math.min(1, rx));
            ry = Math.max(0, Math.min(1, ry));
            focusX = originX + rx * oldWidth;
            focusY = originY + ry * oldHeight;
            delta = event.deltaY;
            if (event.deltaMode === 1) {
                delta *= 16;
            } else if (event.deltaMode === 2) {
                delta *= svgBounds.height;
            }
            nextZoom = viewZoom * Math.exp(-delta * 0.0012);
            nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
            if (Math.abs(nextZoom - 1) < 0.02) {
                nextZoom = 1;
            }
            viewZoom = nextZoom;
            if (viewZoom === 1) {
                viewOrigin = null;
            } else {
                newWidth = fitted.w / viewZoom;
                newHeight = fitted.h / viewZoom;
                viewOrigin = {
                    x: focusX - rx * newWidth,
                    y: focusY - ry * newHeight
                };
            }
            writeViewBox();
        }

        function stairBox(stair) {
            var turned = stair.rotation === 90 || stair.rotation === 270;
            return {
                w: turned ? STAIR_D : STAIR_W,
                d: turned ? STAIR_W : STAIR_D
            };
        }

        function findStair(id) {
            var index;
            var stairs = state.stairs || [];
            for (index = 0; index < stairs.length; index += 1) {
                if (stairs[index].id === id) {
                    return stairs[index];
                }
            }
            return null;
        }

        function stairInside(stair, ignore) {
            var box = stairBox(stair);
            return boxInHouse(stair.x, stair.y, box.w, box.d) && !coversPassage(stair.x, stair.y, box.w, box.d) && !overlapsPieces(stair.x, stair.y, box.w, box.d, stair.id, false, ignore);
        }

        function nudgeStair(stair) {
            var startX = stair.x;
            var startY = stair.y;
            var radius;
            var dx;
            var dy;
            if (stairInside(stair)) {
                return true;
            }
            for (radius = 0.5; radius <= 6; radius += 0.5) {
                for (dx = -radius; dx <= radius; dx += 0.5) {
                    for (dy = -radius; dy <= radius; dy += 0.5) {
                        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) {
                            continue;
                        }
                        stair.x = snap(startX + dx);
                        stair.y = snap(startY + dy);
                        if (stairInside(stair)) {
                            return true;
                        }
                    }
                }
            }
            stair.x = startX;
            stair.y = startY;
            return false;
        }

        function levelForStair(stair) {
            var down = stairGoesDown(stair);
            if (state.activeLevelId === 'first') {
                return findLevel(down ? 'basement' : 'second');
            }
            if (state.activeLevelId === 'second' && !down) {
                return findLevel('first');
            }
            if (state.activeLevelId === 'basement' && down) {
                return findLevel('first');
            }
            return null;
        }

        function mirrorStair(stair, remove) {
            var level = levelForStair(stair);
            var fromLevel;
            var fromOrigin;
            var toOrigin;
            var placed;
            var list;
            var index;
            var existing = null;
            if (!level) {
                return;
            }
            list = level.stairs || [];
            level.stairs = list;
            for (index = 0; index < list.length; index += 1) {
                if (list[index].id === stair.id) {
                    existing = list[index];
                    break;
                }
            }
            if (remove) {
                if (existing) {
                    list.splice(index, 1);
                }
                return;
            }
            fromLevel = findLevel(state.activeLevelId);
            fromOrigin = roomOrigin(fromLevel && fromLevel.room);
            toOrigin = roomOrigin(level.room);
            placed = cloneData(stair);
            placed.x = snap(stair.x + fromOrigin.x - toOrigin.x);
            placed.y = snap(stair.y + fromOrigin.y - toOrigin.y);
            if (!stairFitsRoom(placed, level.room)) {
                if (existing) {
                    setStatus(stairGoesDown(stair) ? 'The basement keeps those stairs in its own room.' : 'The second story keeps those stairs in its own room.');
                }
                return;
            }
            if (existing) {
                existing.x = placed.x;
                existing.y = placed.y;
                existing.rotation = placed.rotation;
                return;
            }
            list.push(placed);
        }

        function keepAccessMessage(id) {
            var level = state.activeLevelId === 'first' ? null : findLevel('first');
            var stairs = state.activeLevelId === 'first' ? (state.stairs || []) : ((level && level.stairs) || []);
            var stair = null;
            var ups;
            var downs;
            stairs.forEach(function (entry) {
                if (entry.id === id) {
                    stair = entry;
                }
            });
            if (!stair) {
                return '';
            }
            if (!stairGoesDown(stair) && findLevel('second')) {
                ups = firstFloorUpStairs();
                if (ups.length === 1 && ups[0].id === stair.id) {
                    return 'Keep these stairs. The second story uses them.';
                }
            }
            if (stairGoesDown(stair) && findLevel('basement')) {
                downs = firstFloorDownStairs();
                if (downs.length === 1 && downs[0].id === stair.id && !firstFloorCellar().length) {
                    return 'Keep these stairs. The basement uses them.';
                }
            }
            return '';
        }

        function stairsMarkup() {
            return (state.stairs || []).map(function (stair) {
                var selected = isPicked(stair.id);
                var down = stairGoesDown(stair);
                var box = stairBox(stair);
                var transform = 'translate(' + num(stair.x + box.w / 2) + ' ' + num(stair.y + box.d / 2) + ') rotate(' + (stair.rotation || 0) + ') translate(' + num(-STAIR_W / 2) + ' ' + num(-STAIR_D / 2) + ')';
                var treads = '';
                var step;
                var arrow;
                for (step = 1; step < 8; step += 1) {
                    treads += '<line pointer-events="none" x1="0.18" y1="' + num((STAIR_D / 8) * step) + '" x2="' + num(STAIR_W - 0.18) + '" y2="' + num((STAIR_D / 8) * step) + '" stroke="' + (down ? '#d7c4b0' : '#5c6b73') + '" stroke-width="0.045"></line>';
                }
                arrow = down
                    ? num(STAIR_W / 2) + ',' + num(STAIR_D - 0.35) + ' ' + num(STAIR_W / 2 - 0.28) + ',' + num(STAIR_D - 1.05) + ' ' + num(STAIR_W / 2 + 0.28) + ',' + num(STAIR_D - 1.05)
                    : num(STAIR_W / 2) + ',0.35 ' + num(STAIR_W / 2 - 0.28) + ',1.05 ' + num(STAIR_W / 2 + 0.28) + ',1.05';
                return '<g data-kind="stair" data-id="' + stair.id + '" transform="' + transform + '">' +
                    '<rect class="room-builder__stair' + (down ? ' room-builder__stair--down' : '') + (selected ? ' is-selected' : '') + '" x="0" y="0" width="' + STAIR_W + '" height="' + STAIR_D + '"></rect>' +
                    treads +
                    '<polygon pointer-events="none" fill="' + (down ? '#f4efe6' : '#16332f') + '" points="' + arrow + '"></polygon>' +
                    '</g>';
            }).join('');
        }

        function gridMarkup() {
            var lines = '';
            var x;
            var y;
            var gridWidth = state.room.spanW || state.room.width;
            var gridDepth = state.room.spanD || state.room.depth;
            for (x = 1; x < gridWidth; x += 1) {
                lines += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + num(gridDepth) + '"></line>';
            }
            for (y = 1; y < gridDepth; y += 1) {
                lines += '<line x1="0" y1="' + y + '" x2="' + num(gridWidth) + '" y2="' + y + '"></line>';
            }
            return lines;
        }

        function wallsMarkup(walls) {
            var paths = [];
            walls.forEach(function (wall) {
                var gaps = state.openings.filter(function (opening) {
                    return opening.wall === wall.id;
                }).map(function (opening) {
                    return { start: opening.offset, end: opening.offset + opening.width };
                }).sort(function (a, b) {
                    return a.start - b.start;
                });
                var cursor = 0;
                var parts = [];
                gaps.forEach(function (gap) {
                    if (gap.start > cursor) {
                        parts.push([cursor, gap.start]);
                    }
                    cursor = Math.max(cursor, gap.end);
                });
                if (cursor < wall.length) {
                    parts.push([cursor, wall.length]);
                }
                parts.forEach(function (part) {
                    var start = part[0];
                    var end = part[1];
                    if (!wall.bulge || Math.abs(wall.bulge) < 0.05) {
                        var dx = wall.length ? (wall.x2 - wall.x1) / wall.length : 0;
                        var dy = wall.length ? (wall.y2 - wall.y1) / wall.length : 0;
                        if (start <= 0) {
                            start = -0.08;
                        }
                        if (end >= wall.length) {
                            end = wall.length + 0.08;
                        }
                        paths.push('M ' + num(wall.x1 + dx * start) + ' ' + num(wall.y1 + dy * start) + ' L ' + num(wall.x1 + dx * end) + ' ' + num(wall.y1 + dy * end));
                        return;
                    }
                    paths.push(subArcPath(wall, Math.max(0, start), Math.min(wall.length, end)));
                });
            });
            return '<g class="room-builder__wall" pointer-events="none">' + paths.map(function (path) {
                return '<path d="' + path + '"></path>';
            }).join('') + '</g>';
        }

        function wallHitMarkup(walls) {
            return walls.map(function (wall) {
                var selected = state.selected && state.selected.type === 'wall' && state.selected.id === wall.id;
                return '<path class="room-builder__wall-hit' + (selected ? ' is-selected' : '') + '" data-kind="wall" data-id="' + wall.id + '" d="' + arcPath(wall.x1, wall.y1, wall.x2, wall.y2, wall.bulge || 0) + '"></path>';
            }).join('');
        }

        function wallOutward(wall) {
            var mid = pointAlongWall(wall, wall.length / 2);
            var dx = wall.x2 - wall.x1;
            var dy = wall.y2 - wall.y1;
            var span = Math.hypot(dx, dy) || 1;
            var nx = -dy / span;
            var ny = dx / span;
            if (pointInside(mid.x + nx * 0.4, mid.y + ny * 0.4)) {
                nx = -nx;
                ny = -ny;
            }
            return { x: nx, y: ny, mx: mid.x, my: mid.y };
        }

        function wallHandleMarkup() {
            var wall;
            var cursor;
            if (!state.selected || state.selected.type !== 'wall') {
                return '';
            }
            wall = findWall(state.selected.id);
            if (!wall) {
                return '';
            }
            cursor = 'grab';
            var curve = pointAlongWall(wall, wall.length / 2);
            var dx = wall.x2 - wall.x1;
            var dy = wall.y2 - wall.y1;
            var span = Math.hypot(dx, dy) || 1;
            var bow = wall.bulge || 0;
            if (Math.abs(bow) < 0.05) {
                curve = {
                    x: curve.x + (-dy / span) * 0.85,
                    y: curve.y + (dx / span) * 0.85
                };
            }
            return '<circle class="room-builder__wall-end" data-kind="wall-end" data-end="1" data-id="' + wall.id + '" cx="' + num(wall.x1) + '" cy="' + num(wall.y1) + '" r="0.32" style="cursor:' + cursor + '"></circle>' +
                '<circle class="room-builder__wall-end" data-kind="wall-end" data-end="2" data-id="' + wall.id + '" cx="' + num(wall.x2) + '" cy="' + num(wall.y2) + '" r="0.32" style="cursor:' + cursor + '"></circle>' +
                '<circle class="room-builder__wall-curve" data-kind="wall-curve" data-id="' + wall.id + '" cx="' + num(curve.x) + '" cy="' + num(curve.y) + '" r="0.28"></circle>';
        }

        function wallLabelMarkup(walls) {
            return walls.map(function (wall) {
                var outward = wallOutward(wall);
                var x = outward.mx + outward.x * 1.05;
                var y = outward.my + outward.y * 1.05;
                return '<text class="room-builder__wall-label" data-kind="wall" data-id="' + wall.id + '" text-anchor="middle" dominant-baseline="middle" font-size="0.42" x="' + num(x) + '" y="' + num(y) + '">' + formatFeet(wall.length) + ' ft</text>';
            }).join('');
        }

        function itemsMarkup(rugs) {
            return state.items.filter(function (item) {
                var entry = catalogItem(item.catalogId);
                var isRug = entry.kind === 'rug';
                return rugs ? isRug : !isRug;
            }).map(function (item) {
                var entry = catalogItem(item.catalogId);
                var drawn = drawingEntry(item);
                var picked = isPicked(item.id);
                var primary = state.selected && state.selected.type === 'item' && state.selected.id === item.id;
                var markup = '<g data-kind="item" data-id="' + item.id + '" transform="' + itemTransform(item) + '">';
                markup += '<title>' + entry.name + '</title>';
                markup += pieceArt(drawn, picked);
                if (primary) {
                    markup += '<g class="room-builder__item-size" pointer-events="none">';
                    markup += '<text class="room-builder__item-width" text-anchor="middle" dominant-baseline="hanging" font-size="0.4" x="' + num(drawn.width / 2) + '" y="' + num(drawn.depth + 0.18) + '">' + formatFeet(drawn.width) + ' ft</text>';
                    markup += '<text class="room-builder__item-depth" text-anchor="middle" font-size="0.4" transform="translate(' + num(drawn.width + 0.28) + ' ' + num(drawn.depth / 2) + ') rotate(-90)">' + formatFeet(drawn.depth) + ' ft</text>';
                    markup += '</g>';
                }
                markup += '</g>';
                return markup;
            }).join('');
        }

        function backLine(item, width, depth, isBed) {
            var x = item.x;
            var y = item.y;
            var inset = isBed ? 0.22 : 0.12;
            if (item.rotation === 90) {
                return [x + width - inset, y + 0.15, x + width - inset, y + depth - 0.15];
            }
            if (item.rotation === 180) {
                return [x + 0.15, y + depth - inset, x + width - 0.15, y + depth - inset];
            }
            if (item.rotation === 270) {
                return [x + inset, y + 0.15, x + inset, y + depth - 0.15];
            }
            return [x + 0.15, y + inset, x + width - 0.15, y + inset];
        }

        function inwardNormal(wall) {
            var mid = pointAlongWall(wall, (wall.length || 0) / 2);
            var dx = wall.x2 - wall.x1;
            var dy = wall.y2 - wall.y1;
            var span = Math.hypot(dx, dy) || 1;
            var nx = -dy / span;
            var ny = dx / span;
            if (pointInside(mid.x + nx * 0.4, mid.y + ny * 0.4)) {
                return { x: nx, y: ny };
            }
            return { x: -nx, y: -ny };
        }

        function openingsMarkup() {
            return state.openings.map(function (opening) {
                var wall = findWall(opening.wall);
                var kind = opening.kind || 'door';
                var graphic = wall && (kind === 'window' ? windowGraphic(opening, wall) : kind === 'doorway' ? doorwayGraphic(opening, wall) : doorPath(opening, wall));
                var normal;
                var hit;
                var selected;
                var cursor;
                var markClass;
                if (!wall || !graphic) {
                    return '';
                }
                normal = inwardNormal(wall);
                hit = openingHit(opening, wall);
                selected = state.selected && state.selected.type === 'opening' && state.selected.id === opening.id;
                cursor = 'grab';
                markClass = kind === 'window' ? 'room-builder__window' : kind === 'doorway' ? 'room-builder__doorway' : 'room-builder__door';
                return '<g data-kind="opening" data-id="' + opening.id + '" style="cursor:' + cursor + '">' +
                    '<path d="' + hit + '" fill="none" stroke="transparent" stroke-width="1.2"></path>' +
                    '<path class="' + markClass + (selected ? ' is-selected' : '') + '" pointer-events="none" d="' + graphic + '"></path>' +
                    '</g>';
            }).join('');
        }

        function doorwayGraphic(opening, wall) {
            var start = pointAlongWall(wall, opening.offset);
            var end = pointAlongWall(wall, opening.offset + opening.width);
            var dx = end.x - start.x;
            var dy = end.y - start.y;
            var span = Math.hypot(dx, dy) || 1;
            var px = (-dy / span) * 0.4;
            var py = (dx / span) * 0.4;
            return 'M ' + num(start.x - px) + ' ' + num(start.y - py) + ' L ' + num(start.x + px) + ' ' + num(start.y + py) +
                ' M ' + num(end.x - px) + ' ' + num(end.y - py) + ' L ' + num(end.x + px) + ' ' + num(end.y + py);
        }

        function windowGraphic(opening, wall) {
            var start = pointAlongWall(wall, opening.offset);
            var end = pointAlongWall(wall, opening.offset + opening.width);
            var inward = inwardNormal(wall);
            var glass = 0.14;
            return 'M ' + num(start.x) + ' ' + num(start.y) + ' L ' + num(end.x) + ' ' + num(end.y) +
                ' M ' + num(start.x + inward.x * glass) + ' ' + num(start.y + inward.y * glass) +
                ' L ' + num(end.x + inward.x * glass) + ' ' + num(end.y + inward.y * glass) +
                ' M ' + num(start.x - inward.x * glass) + ' ' + num(start.y - inward.y * glass) +
                ' L ' + num(end.x - inward.x * glass) + ' ' + num(end.y - inward.y * glass);
        }

        function openingHit(opening, wall) {
            var start = pointAlongWall(wall, opening.offset);
            var end = pointAlongWall(wall, opening.offset + opening.width);
            return 'M ' + num(start.x) + ' ' + num(start.y) + ' L ' + num(end.x) + ' ' + num(end.y);
        }

        function doorSwing(opening, wall) {
            var inward = inwardNormal(wall);
            if (opening.swing === 'out') {
                return { x: -inward.x, y: -inward.y };
            }
            return inward;
        }

        function doorGraphic(opening, wall) {
            var normal = doorSwing(opening, wall);
            var hingeAtEnd = opening.hinge === 'end';
            var hinge = pointAlongWall(wall, hingeAtEnd ? opening.offset + opening.width : opening.offset);
            var closed = pointAlongWall(wall, hingeAtEnd ? opening.offset : opening.offset + opening.width);
            var openX = hinge.x + normal.x * opening.width;
            var openY = hinge.y + normal.y * opening.width;
            var dirX = closed.x - hinge.x;
            var dirY = closed.y - hinge.y;
            var cross = dirX * normal.y - dirY * normal.x;
            var sweep = cross > 0 ? 1 : 0;
            return {
                leaf: 'M ' + num(hinge.x) + ' ' + num(hinge.y) + ' L ' + num(openX) + ' ' + num(openY),
                arc: 'M ' + num(closed.x) + ' ' + num(closed.y) + ' A ' + num(opening.width) + ' ' + num(opening.width) + ' 0 0 ' + sweep + ' ' + num(openX) + ' ' + num(openY)
            };
        }

        function doorPath(opening, wall) {
            var graphic = doorGraphic(opening, wall);
            return graphic.leaf + ' ' + graphic.arc;
        }

        function selectionMarkup() {
            return pickedList().map(function (entry) {
                var piece = entry.type === 'stair' ? findStair(entry.id) : findItem(entry.id);
                var box = piece && (entry.type === 'stair' ? stairBox(piece) : footprint(piece));
                var primary = state.selected && state.selected.id === entry.id;
                if (!piece || !box) {
                    return '';
                }
                return '<rect class="room-builder__selection room-builder__pick' + (primary ? ' is-primary' : '') + '" pointer-events="none" fill="none" stroke="#0f766e" stroke-width="' + (primary ? '0.07' : '0.045') + '" stroke-dasharray="0.16 0.1" x="' + num(piece.x - 0.1) + '" y="' + num(piece.y - 0.1) + '" width="' + num(box.w + 0.2) + '" height="' + num(box.d + 0.2) + '"></rect>';
            }).join('');
        }

        function rotateHandleMarkup() {
            var item;
            var point;
            var stair;
            if (!state.selected) {
                return '';
            }
            if (state.selected.type === 'stair') {
                stair = findStair(state.selected.id);
                if (!stair) {
                    return '';
                }
                point = stairRotatePoint(stair);
                return rotateHandle(point, stair.id);
            }
            if (state.selected.type !== 'item') {
                return '';
            }
            item = findItem(state.selected.id);
            if (!item) {
                return '';
            }
            point = rotateHandlePoint(item);
            return rotateHandle(point, item.id);
        }

        function stairRotatePoint(stair) {
            var box = stairBox(stair);
            var rad = ((Number(stair.rotation) || 0) * Math.PI) / 180;
            var reach = Math.sqrt(box.w * box.w + box.d * box.d) / 2 + 0.55;
            return {
                x: stair.x + box.w / 2 + Math.sin(rad) * reach,
                y: stair.y + box.d / 2 - Math.cos(rad) * reach
            };
        }

        function rotateHandle(point, id) {
            return '<g data-kind="rotate" data-id="' + id + '" transform="translate(' + num(point.x) + ' ' + num(point.y) + ')">' +
                '<circle class="room-builder__rotate" cx="0" cy="0" r="0.36"></circle>' +
                '<path pointer-events="none" fill="none" stroke="#0f766e" stroke-width="0.07" d="M -0.16 0.05 A 0.18 0.18 0 1 1 0.12 -0.12"></path>' +
                '<polygon pointer-events="none" fill="#0f766e" points="0.05,-0.24 0.08,-0.02 0.26,-0.1"></polygon>' +
                '</g>';
        }

        function deleteHandleMarkup() {
            var item;
            var size;
            var opening;
            var wall;
            var hit;
            if (!state.selected) {
                return '';
            }
            if (state.selected.type === 'item') {
                item = findItem(state.selected.id);
                if (!item) {
                    return '';
                }
                size = footprint(item);
                return deleteButton(item.x + size.w + 0.08, item.y - 0.08, item.id);
            }
            if (state.selected.type === 'stair') {
                var stair = findStair(state.selected.id);
                var stairSize;
                if (!stair) {
                    return '';
                }
                stairSize = stairBox(stair);
                return deleteButton(stair.x + stairSize.w + 0.08, stair.y - 0.08, stair.id);
            }
            if (state.selected.type === 'opening') {
                opening = findOpening(state.selected.id);
                wall = opening && findWall(opening.wall);
                if (!opening || !wall) {
                    return '';
                }
                var mid = pointAlongWall(wall, opening.offset + opening.width / 2);
                var inward = inwardNormal(wall);
                return deleteButton(mid.x + inward.x * 0.55, mid.y + inward.y * 0.55, opening.id);
            }
            return '';
        }

        function deleteButton(x, y, id) {
            return '<g class="room-builder__remove" data-kind="remove" data-id="' + id + '" transform="translate(' + num(x) + ' ' + num(y) + ')">' +
                '<circle r="0.34"></circle>' +
                '<path pointer-events="none" fill="none" stroke="#e36a4a" stroke-width="0.08" stroke-linecap="round" d="M -0.12 -0.12 L 0.12 0.12 M 0.12 -0.12 L -0.12 0.12"></path>' +
                '</g>';
        }

        function jogField(text, value) {
            var label = document.createElement('label');
            var input = document.createElement('input');
            label.className = 'room-builder__field';
            label.appendChild(document.createTextNode(text));
            input.type = 'number';
            input.min = '0';
            input.max = String(MAX_ROOM);
            input.step = '0.5';
            input.value = String(value);
            label.appendChild(input);
            label.appendChild(document.createTextNode('ft'));
            return { label: label, input: input };
        }

        function turnWall45(id) {
            var segment;
            var end;
            var next;
            ensureCustom();
            segment = findSegment(id);
            if (!segment) {
                return;
            }
            end = endAtAngle(segment.x1, segment.y1, Math.atan2(segment.y2 - segment.y1, segment.x2 - segment.x1) + Math.PI / 4, segmentSpan(segment));
            next = cloneSegments(state.room.segments);
            if (!closeCorner(next, segment.id, segment.x2, segment.y2, segment.x1, segment.y1, end.x, end.y) || !segmentsOk(next)) {
                setStatus('That turn would cross another wall.');
                return;
            }
            state.room.segments = next;
            syncFromSegments(true);
            persist();
            renderPlan();
            renderSelection();
            if (!(state.room.points && state.room.points.length >= 4)) {
                setStatus('Turned the wall 45°. Connect the open ends to close the room.');
                return;
            }
            setStatus('Turned the wall 45°. The corner stayed closed.');
        }

        function curveWall(id) {
            var segment;
            var wall;
            var inward;
            var dx;
            var dy;
            var chord;
            var normal;
            var sign;
            var bulge;
            var next;
            ensureCustom();
            segment = findSegment(id);
            wall = findWall(id);
            if (!segment || !wall) {
                return;
            }
            next = cloneSegments(state.room.segments);
            next.forEach(function (item) {
                if (item.id !== id) {
                    return;
                }
                if (item.bulge && Math.abs(item.bulge) >= 0.5) {
                    delete item.bulge;
                    return;
                }
                dx = item.x2 - item.x1;
                dy = item.y2 - item.y1;
                chord = Math.hypot(dx, dy) || 1;
                normal = leftNormal(dx, dy, chord);
                inward = inwardNormal(wall);
                sign = normal.x * inward.x + normal.y * inward.y > 0 ? -1 : 1;
                bulge = sign * Math.max(0.5, Math.min(chord / 2, snap(chord / 4)));
                if (!curveClear(item, bulge)) {
                    bulge = 0;
                }
                if (bulge) {
                    item.bulge = bulge;
                } else {
                    delete item.bulge;
                }
            });
            if (!segmentsOk(next)) {
                setStatus('That curve would cross another wall.');
                return;
            }
            state.room.segments = next;
            syncFromSegments(true);
            persist();
            renderPlan();
            renderSelection();
            segment = findSegment(id);
            setStatus(segment && segment.bulge ? 'Wall curved. Drag the curve handle to change the bow.' : 'Wall straightened.');
        }

        function renderWallSelection() {
            var wall = findWall(state.selected.id);
            var label;
            var note;
            var lengthLabel;
            var lengthInput;
            if (!wall) {
                state.selected = null;
                return;
            }
            label = document.createElement('p');
            label.textContent = 'Wall · ' + formatFeet(wall.length) + ' ft · ' + wallDegrees(wall) + '°' + (wall.bulge && Math.abs(wall.bulge) >= 0.5 ? ' · curved' : '');
            note = document.createElement('p');
            note.textContent = 'Drag a round handle to turn that end in 45° steps. The next wall follows so the corner stays closed. Drag the curve handle to bow the wall.';
            lengthLabel = document.createElement('label');
            lengthLabel.className = 'room-builder__field';
            lengthLabel.appendChild(document.createTextNode('Length'));
            lengthInput = document.createElement('input');
            lengthInput.type = 'number';
            lengthInput.min = String(MIN_WALL);
            lengthInput.max = String(MAX_ROOM);
            lengthInput.step = '0.5';
            lengthInput.value = String(snap(wall.length));
            lengthLabel.appendChild(lengthInput);
            lengthLabel.appendChild(document.createTextNode('ft'));
            lengthInput.addEventListener('change', function () {
                var current;
                if (!setWallLength(wall.id, parseFloat(lengthInput.value))) {
                    current = findWall(wall.id);
                    lengthInput.value = current ? String(snap(current.length)) : lengthInput.value;
                }
            });
            lengthInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    lengthInput.blur();
                }
            });
            selectionEl.appendChild(label);
            selectionEl.appendChild(note);
            selectionEl.appendChild(lengthLabel);
            selectionEl.appendChild(actionButton('Turn 45°', function () {
                turnWall45(wall.id);
            }));
            selectionEl.appendChild(actionButton(wall.bulge && Math.abs(wall.bulge) >= 0.5 ? 'Straighten' : 'Curve', function () {
                curveWall(wall.id);
            }));
            selectionEl.appendChild(actionButton('Delete', deleteSelected, true));
        }

        function renderSelection() {
            selectionEl.innerHTML = '';
            if (!state.selected) {
                return;
            }
            if (state.selected.type === 'item') {
                var item = findItem(state.selected.id);
                var entry = item && catalogItem(item.catalogId);
                if (!item || !entry) {
                    state.selected = null;
                    return;
                }
                var size = placedSize(item);
                var label = document.createElement('p');
                var note = document.createElement('p');
                var groupCount = pickedList().length;
                var form = canReshape(entry) ? sofaForm(item, entry) : '';
                var shapeLabel = form === 'curve' ? 'Curved' : form === 'cane' ? 'Candy cane' : '';
                if (groupCount > 1) {
                    var groupLine = document.createElement('p');
                    groupLine.textContent = groupCount + ' pieces selected. Drag one to move them together.';
                    selectionEl.appendChild(groupLine);
                }
                if (form === 'straight' && entry.form) {
                    shapeLabel = 'Straight';
                }
                var high = placedHeight(item);
                var offFloor = entry.base ? ', ' + entry.base + ' ft off the floor' : '';
                label.textContent = entry.name + (shapeLabel && entry.name.toLowerCase().indexOf(shapeLabel.toLowerCase()) === -1 ? ' · ' + shapeLabel : '') + ' · ' + formatFeet(size.width) + ' × ' + formatFeet(size.depth) + ' ft · ' + high + ' ft high' + offFloor + ' · ' + normalizeRotation(item.rotation) + '°';
                note.textContent = canReshape(entry)
                    ? 'Set the width, depth, and height, then choose straight, curved, or candy cane. The open part of a curve or cane stays clear.'
                    : (size.limits.tight
                        ? 'This piece stays close to its real size. Height runs from the floor, or from where a wall piece is hung.'
                        : 'Set the size you need. Width runs side to side. Depth runs front to back. Height is the vertical size.');
                selectionEl.appendChild(label);
                selectionEl.appendChild(note);
                selectionEl.appendChild(sizeField('Width', size.width, size.limits.minW, size.limits.maxW, 'width'));
                selectionEl.appendChild(sizeField('Depth', size.depth, size.limits.minD, size.limits.maxD, 'depth'));
                selectionEl.appendChild(sizeField('Height', placedHeight(item), entry.kind === 'rug' ? 0.05 : 0.3, 12, 'height', '0.1'));
                if (canReshape(entry)) {
                    selectionEl.appendChild(shapeButton('Straight', 'straight', form, item.id));
                    selectionEl.appendChild(shapeButton('Curve', 'curve', form, item.id));
                    selectionEl.appendChild(shapeButton('Candy cane', 'cane', form, item.id));
                }
                selectionEl.appendChild(actionButton('Turn 90°', function () {
                    rotateSelected(90);
                }));
                selectionEl.appendChild(actionButton('Turn 180°', function () {
                    rotateSelected(180);
                }));
                selectionEl.appendChild(actionButton('Delete', deleteSelected, true));
                return;
            }
            if (state.selected.type === 'wall') {
                renderWallSelection();
                return;
            }
            if (state.selected.type === 'stair') {
                renderStairSelection();
                return;
            }
            var opening = findOpening(state.selected.id);
            if (!opening || !findWall(opening.wall)) {
                state.selected = null;
                return;
            }
            var doorLabel = document.createElement('p');
            var isDoor = (opening.kind || 'door') === 'door';
            doorLabel.textContent = openingName(opening) + ' · ' + formatFeet(opening.width) + ' ft';
            var widthLabel = document.createElement('label');
            widthLabel.className = 'room-builder__field';
            widthLabel.appendChild(document.createTextNode('Length'));
            var widthControl = document.createElement('input');
            widthControl.type = 'number';
            widthControl.min = '2';
            widthControl.max = String(wallLength(opening.wall));
            widthControl.step = '0.5';
            widthControl.value = String(opening.width);
            widthLabel.appendChild(widthControl);
            widthLabel.appendChild(document.createTextNode('ft'));
            widthControl.addEventListener('change', function () {
                updateDoorWidth(opening.id, widthControl);
            });
            widthControl.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    widthControl.blur();
                }
            });
            selectionEl.appendChild(doorLabel);
            selectionEl.appendChild(widthLabel);
            if (isDoor) {
                selectionEl.appendChild(actionButton('Flip hinge', function () {
                    changeDoorSwing(opening.id, 'hinge');
                }));
                selectionEl.appendChild(actionButton(opening.swing === 'out' ? 'Swing in' : 'Swing out', function () {
                    changeDoorSwing(opening.id, 'swing');
                }));
            }
            selectionEl.appendChild(actionButton('Delete', deleteSelected, true));
        }

        function changeDoorSwing(id, part) {
            var current = findOpening(id);
            var previousHinge;
            var previousSwing;
            if (!current) {
                return;
            }
            previousHinge = current.hinge;
            previousSwing = current.swing;
            if (part === 'hinge') {
                current.hinge = current.hinge === 'end' ? 'start' : 'end';
            } else {
                current.swing = current.swing === 'out' ? 'in' : 'out';
            }
            if (openingBlockedByFurniture(current)) {
                current.hinge = previousHinge;
                current.swing = previousSwing;
                setStatus('Furniture is blocking that door.');
                renderSelection();
                return;
            }
            persist();
            renderPlan();
            renderSelection();
            if (part === 'hinge') {
                setStatus('The door now swings from the other end.');
            } else {
                setStatus(current.swing === 'out' ? 'The door swings out of the room.' : 'The door swings into the room.');
            }
        }

        function canReshape(entry) {
            var symbol = symbolFor(entry);
            return symbol === 'sofa' || symbol === 'sectional' || symbol === 'chaise';
        }

        function sofaForm(item, entry) {
            if (item.form === 'curve' || item.form === 'cane' || item.form === 'straight') {
                return item.form;
            }
            return (entry && entry.form) || 'straight';
        }

        function shapeButton(label, form, current, id) {
            var button = actionButton(label, function () {
                setSofaForm(id, form);
            });
            if (current === form) {
                button.classList.add('is-active');
            }
            return button;
        }

        function setSofaForm(id, form) {
            var item = findItem(id);
            var entry;
            var previous;
            if (!item) {
                return;
            }
            entry = catalogItem(item.catalogId);
            previous = item.form;
            if ((entry.form || 'straight') === form) {
                delete item.form;
            } else {
                item.form = form;
            }
            if (!itemInside(item)) {
                if (previous) {
                    item.form = previous;
                } else {
                    delete item.form;
                }
                setStatus('That shape does not fit there.');
                renderSelection();
                return;
            }
            persist();
            renderPlan();
            renderSelection();
            if (form === 'curve') {
                setStatus('The sofa now curves.');
            } else if (form === 'cane') {
                setStatus('The sofa hooks like a candy cane.');
            } else {
                setStatus('The sofa is straight.');
            }
        }

        function actionButton(label, handler, danger) {
            var button = makeButton(label, 'room-builder__button' + (danger ? ' room-builder__button--danger' : ''));
            button.addEventListener('click', handler);
            return button;
        }

        function updateDoorWidth(id, input) {
            var opening = findOpening(id);
            if (!opening) {
                return;
            }
            var length = wallLength(opening.wall);
            var width = snap(parseFloat(input.value));
            if (!isFinite(width)) {
                input.value = String(opening.width);
                return;
            }
            width = Math.max(2, Math.min(width, length));
            var offset = opening.offset;
            var previousWidth = opening.width;
            var previousOffset = opening.offset;
            if (offset + width > length) {
                offset = snap(length - width);
            }
            if (overlapsOpening(opening.wall, offset, width, opening.id)) {
                input.value = String(opening.width);
                setStatus('That length overlaps another opening.');
                return;
            }
            opening.width = width;
            opening.offset = offset;
            if (openingBlockedByFurniture(opening)) {
                opening.width = previousWidth;
                opening.offset = previousOffset;
                input.value = String(previousWidth);
                setStatus('Furniture is blocking that ' + openingName(opening).toLowerCase() + '.');
                return;
            }
            input.value = String(width);
            persist();
            renderPlan();
            renderSelection();
            setStatus('');
        }

        function turnItem(item, rotation, centerX, centerY, nudge) {
            var previousRotation = item.rotation;
            var previousX = item.x;
            var previousY = item.y;
            var before = footprint(item);
            var cx = centerX == null ? item.x + before.w / 2 : centerX;
            var cy = centerY == null ? item.y + before.d / 2 : centerY;
            var after;
            item.rotation = normalizeRotation(rotation);
            after = footprint(item);
            item.x = Math.round((cx - after.w / 2) * 100) / 100;
            item.y = Math.round((cy - after.d / 2) * 100) / 100;
            if (!itemInside(item) && !(nudge && nudgeInside(item))) {
                item.rotation = previousRotation;
                item.x = previousX;
                item.y = previousY;
                return false;
            }
            return true;
        }

        function sizeField(labelText, value, minValue, maxValue, axis, step) {
            var label = document.createElement('label');
            var input = document.createElement('input');
            label.className = 'room-builder__field';
            label.appendChild(document.createTextNode(labelText));
            input.type = 'number';
            input.min = String(minValue);
            input.max = String(maxValue);
            input.step = step || '0.5';
            input.inputMode = 'decimal';
            input.value = step === '0.1' ? String(Math.round(Number(value) * 10) / 10) : formatFeet(value);
            input.addEventListener('change', function () {
                resizeSelected(axis, input.value);
            });
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    resizeSelected(axis, input.value);
                }
            });
            label.appendChild(input);
            label.appendChild(document.createTextNode('ft'));
            return label;
        }

        function resizeSelected(axis, value) {
            var item = state.selected && state.selected.type === 'item' ? findItem(state.selected.id) : null;
            var requested = snap(Number(value));
            var size;
            var limits;
            var next;
            var before;
            var centerX;
            var centerY;
            var previousWidth;
            var previousDepth;
            var previousX;
            var previousY;
            var after;
            var limited;
            if (!item || (axis !== 'height' && !isFinite(requested))) {
                renderSelection();
                return;
            }
            if (axis === 'height') {
                var tall = Math.round(Number(value) * 10) / 10;
                var heightEntry = catalogItem(item.catalogId);
                var shortest = heightEntry && heightEntry.kind === 'rug' ? 0.05 : 0.3;
                if (!isFinite(tall)) {
                    renderSelection();
                    return;
                }
                tall = Math.min(12, Math.max(shortest, tall));
                if (heightEntry && Math.abs(tall - Number(heightEntry.height)) < 0.05) {
                    delete item.height;
                } else {
                    item.height = tall;
                }
                persist();
                renderSelection();
                setStatus('');
                return;
            }
            size = placedSize(item);
            limits = size.limits;
            next = axis === 'depth'
                ? Math.min(limits.maxD, Math.max(limits.minD, requested))
                : Math.min(limits.maxW, Math.max(limits.minW, requested));
            if (Math.abs(next - (axis === 'depth' ? size.depth : size.width)) < 0.01) {
                renderSelection();
                return;
            }
            limited = Math.abs(next - requested) > 0.01;
            before = footprint(item);
            centerX = item.x + before.w / 2;
            centerY = item.y + before.d / 2;
            previousWidth = item.width;
            previousDepth = item.depth;
            previousX = item.x;
            previousY = item.y;
            if (axis === 'depth') {
                if (Math.abs(next - size.entry.depth) < 0.01) {
                    delete item.depth;
                } else {
                    item.depth = next;
                }
            } else if (Math.abs(next - size.entry.width) < 0.01) {
                delete item.width;
            } else {
                item.width = next;
            }
            after = footprint(item);
            item.x = Math.round((centerX - after.w / 2) * 100) / 100;
            item.y = Math.round((centerY - after.d / 2) * 100) / 100;
            if (!itemInside(item) && !nudgeInside(item)) {
                if (previousWidth === undefined) {
                    delete item.width;
                } else {
                    item.width = previousWidth;
                }
                if (previousDepth === undefined) {
                    delete item.depth;
                } else {
                    item.depth = previousDepth;
                }
                item.x = previousX;
                item.y = previousY;
                setStatus(size.entry.name + ' does not fit at that size.');
                renderSelection();
                return;
            }
            after = footprint(item);
            persist();
            renderPlan();
            renderSelection();
            if (Math.abs(item.x + after.w / 2 - centerX) > 0.2 || Math.abs(item.y + after.d / 2 - centerY) > 0.2) {
                setStatus('Sized to ' + formatFeet(placedSize(item).width) + ' × ' + formatFeet(placedSize(item).depth) + ' ft and shifted so it stays inside the room.');
            } else if (limited) {
                setStatus('Sized to ' + formatFeet(placedSize(item).width) + ' × ' + formatFeet(placedSize(item).depth) + ' ft. That is as far as this piece goes.');
            } else {
                setStatus('Sized to ' + formatFeet(placedSize(item).width) + ' × ' + formatFeet(placedSize(item).depth) + ' ft.');
            }
        }

        function rotateSelected(degrees) {
            var item = state.selected && state.selected.type === 'item' ? findItem(state.selected.id) : null;
            var step = degrees == null ? 90 : degrees;
            if (!item) {
                return;
            }
            var before = footprint(item);
            var centerX = item.x + before.w / 2;
            var centerY = item.y + before.d / 2;
            var after;
            if (!turnItem(item, item.rotation + step, null, null, true)) {
                setStatus(catalogItem(item.catalogId).name + ' does not fit that way.');
                return;
            }
            after = footprint(item);
            if (Math.abs(item.x + after.w / 2 - centerX) > 0.2 || Math.abs(item.y + after.d / 2 - centerY) > 0.2) {
                setStatus('Turned ' + step + '° and shifted so it stays inside the room.');
            } else {
                setStatus('Turned ' + step + '°.');
            }
            persist();
            renderPlan();
            renderSelection();
        }

        function deleteSelected() {
            var removedSelection;
            if (!state.selected) {
                return;
            }
            removedSelection = state.selected.id;
            if (state.selected.type === 'item') {
                var removedItem = findItem(state.selected.id);
                if (removedItem && removedItem.catalogId === 'cellar-access' && state.activeLevelId === 'first' && findLevel('basement') && !firstFloorDownStairs().length && firstFloorCellar().length === 1) {
                    setStatus('Keep the cellar access, or add stairs down. The basement uses it.');
                    return;
                }
                state.items = state.items.filter(function (item) {
                    return item.id !== state.selected.id;
                });
            } else if (state.selected.type === 'wall') {
                ensureCustom();
                var removedId = state.selected.id;
                state.room.segments = (state.room.segments || []).filter(function (segment) {
                    return segment.id !== removedId;
                });
                state.openings = state.openings.filter(function (opening) {
                    return opening.wall !== removedId;
                });
                clearPicks();
                syncFromSegments(true);
                persist();
                renderPlan();
                renderSelection();
                setStatus(state.room.points && state.room.points.length >= 4 ? 'Wall removed.' : 'Connect the open ends to close the room.');
                return;
            } else if (state.selected.type === 'stair') {
                var removedStair;
                var accessMessage = keepAccessMessage(state.selected.id);
                if (accessMessage) {
                    setStatus(accessMessage);
                    return;
                }
                removedStair = findStair(state.selected.id);
                state.stairs = (state.stairs || []).filter(function (stair) {
                    return stair.id !== state.selected.id;
                });
                if (removedStair) {
                    mirrorStair(removedStair, true);
                }
            } else {
                state.openings = state.openings.filter(function (opening) {
                    return opening.id !== state.selected.id;
                });
            }
            dropPick(removedSelection);
            persist();
            renderPlan();
            renderSelection();
            renderLevels();
            setStatus('');
        }

        function renderStairSelection() {
            var stair = findStair(state.selected.id);
            var label;
            var note;
            if (!stair) {
                state.selected = null;
                return;
            }
            var down = stairGoesDown(stair);
            if (pickedList().length > 1) {
                var groupLine = document.createElement('p');
                groupLine.textContent = pickedList().length + ' pieces selected. Drag one to move them together.';
                selectionEl.appendChild(groupLine);
            }
            label = document.createElement('p');
            label.textContent = (down ? 'Stairs down' : 'Stairs up') + ' · ' + formatFeet(STAIR_W) + ' × ' + formatFeet(STAIR_D) + ' ft · ' + STAIR_RISE + ' ft rise';
            note = document.createElement('p');
            note.textContent = down ? 'Drag the stairs to move them. The arrow points down the flight.' : 'Drag the stairs to move them. The arrow points up the flight.';
            selectionEl.appendChild(label);
            selectionEl.appendChild(note);
            selectionEl.appendChild(actionButton('Turn 90°', function () {
                turnStair(stair.id, 90);
            }));
            selectionEl.appendChild(actionButton('Turn 180°', function () {
                turnStair(stair.id, 180);
            }));
            selectionEl.appendChild(actionButton('Delete', deleteSelected, true));
        }

        function turnStair(id, degrees) {
            var stair = findStair(id);
            var previous;
            var step = degrees == null ? 90 : degrees;
            if (!stair) {
                return;
            }
            previous = stair.rotation || 0;
            stair.rotation = normalizeRotation(previous + step);
            if (!stairInside(stair) && !nudgeStair(stair)) {
                stair.rotation = previous;
                setStatus('Stairs do not fit that way.');
                return;
            }
            mirrorStair(stair, false);
            persist();
            renderPlan();
            renderSelection();
            setStatus('Turned the stairs ' + step + '°.');
        }

        function placeStair(feet) {
            var stair = {
                id: uid('s'),
                x: snap(feet.x - STAIR_W / 2),
                y: snap(feet.y - STAIR_D / 2),
                rotation: 0,
                direction: state.tool === 'stair-down' ? 'down' : 'up'
            };
            if (!stairInside(stair) && !nudgeStair(stair)) {
                setStatus('Stairs need a clear 3 × 8 ft spot inside the room.');
                return;
            }
            if (!state.stairs) {
                state.stairs = [];
            }
            state.stairs.push(stair);
            mirrorStair(stair, false);
            selectOnly('stair', stair.id);
            state.tool = 'select';
            syncDoorTool();
            persist();
            renderPlan();
            renderSelection();
            renderLevels();
            setStatus(stair.direction === 'down'
                ? (state.activeLevelId === 'first' ? 'Stairs down added. You can add a basement now.' : 'Stairs down added.')
                : (state.activeLevelId === 'first' ? 'Stairs added. You can add a second story now.' : 'Stairs added.'));
        }

        function placeItem(catalogId, topLeft, customSize) {
            var entry = catalogItem(catalogId);
            var limits = sizeLimits(entry);
            var item = {
                id: uid('f'),
                catalogId: catalogId,
                x: 0,
                y: 0,
                rotation: 0
            };
            var size;
            var preferred;
            if (customSize) {
                item.width = snap(Math.min(limits.maxW, Math.max(limits.minW, customSize.width)));
                item.depth = snap(Math.min(limits.maxD, Math.max(limits.minD, customSize.depth)));
            }
            size = footprint(item);
            preferred = topLeft || {
                x: (state.room.width - size.w) / 2,
                y: (state.room.depth - size.d) / 2
            };
            if (!findSpot(item, preferred)) {
                setStatus(entry.name + ' does not fit inside the house.');
                return;
            }
            state.items.push(item);
            selectOnly('item', item.id);
            persist();
            renderPlan();
            renderSelection();
            renderLevels();
            setStatus(catalogId === 'cellar-access' && state.activeLevelId === 'first' ? 'Cellar access added. You can add a basement now.' : '');
        }

        function project(wall, x, y) {
            var dx = wall.x2 - wall.x1;
            var dy = wall.y2 - wall.y1;
            var len2 = dx * dx + dy * dy || 1;
            var best = 0;
            var bestDist = Infinity;
            var step;
            var along;
            var point;
            var dist;
            if (!wall.bulge || Math.abs(wall.bulge) < 0.05) {
                return Math.max(0, Math.min(1, ((x - wall.x1) * dx + (y - wall.y1) * dy) / len2)) * (wall.length || Math.hypot(dx, dy));
            }
            for (step = 0; step <= 24; step += 1) {
                along = wall.length * step / 24;
                point = pointAlongWall(wall, along);
                dist = Math.hypot(point.x - x, point.y - y);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = along;
                }
            }
            return best;
        }

        function nearestWall(x, y) {
            var best = null;
            allWalls().forEach(function (wall) {
                var offset = project(wall, x, y);
                var clamped = Math.max(0, Math.min(wall.length, offset));
                var point = pointAlongWall(wall, clamped);
                var dist = Math.hypot(x - point.x, y - point.y);
                if (!best || dist < best.dist) {
                    best = {
                        wall: wall.id,
                        dist: dist,
                        offset: clamped,
                        length: wall.length
                    };
                }
            });
            if (!best || best.dist > DOOR_REACH) {
                return null;
            }
            return best;
        }

        function placeDoor(feet) {
            var kind = state.tool === 'window' || state.tool === 'doorway' ? state.tool : 'door';
            var name = kind === 'window' ? 'window' : kind === 'doorway' ? 'doorway' : 'door';
            var hit = nearestWall(feet.x, feet.y);
            var offset;
            var opening;
            if (!hit) {
                setStatus('Click a wall to add a ' + name + '.');
                return;
            }
            if (DOOR_WIDTH > hit.length) {
                setStatus('This wall is too short for a ' + name + '.');
                return;
            }
            offset = snap(hit.offset - DOOR_WIDTH / 2);
            offset = Math.max(0, Math.min(offset, hit.length - DOOR_WIDTH));
            if (overlapsOpening(hit.wall, offset, DOOR_WIDTH, null)) {
                setStatus('Something is already on that part of the wall.');
                return;
            }
            opening = {
                id: uid(kind === 'window' ? 'w' : kind === 'doorway' ? 'o' : 'd'),
                wall: hit.wall,
                offset: offset,
                width: DOOR_WIDTH,
                hinge: 'start',
                swing: 'in',
                kind: kind
            };
            if (openingBlockedByFurniture(opening)) {
                setStatus('Furniture is blocking that ' + name + '.');
                return;
            }
            state.openings.push(opening);
            selectOnly('opening', opening.id);
            state.tool = 'select';
            syncDoorTool();
            persist();
            renderPlan();
            renderSelection();
            if (kind === 'door') {
                setStatus('Door added. Set its length, flip the hinge, or change the swing.');
            } else if (kind === 'doorway') {
                setStatus('Doorway added. Set its length. Furniture has to stay clear of it.');
            } else {
                setStatus('Window added. Set its length.');
            }
        }

        function hitTarget(node) {
            var element = node;
            while (element && element !== svg) {
                if (element.getAttribute && element.getAttribute('data-kind')) {
                    return element;
                }
                element = element.parentNode;
            }
            return null;
        }

        function capturePointer(event) {
            try {
                svg.setPointerCapture(event.pointerId);
            } catch (error) {
                return;
            }
        }

        function clientToFeet(clientX, clientY) {
            var matrix = svg.getScreenCTM();
            if (!matrix) {
                return { x: 0, y: 0 };
            }
            var point = svg.createSVGPoint();
            point.x = clientX;
            point.y = clientY;
            var local = point.matrixTransform(matrix.inverse());
            return { x: local.x, y: local.y };
        }

        function onPlanPointerDown(event) {
            if (event.button !== 0) {
                return;
            }
            stage.focus();
            var target = hitTarget(event.target);
            var kind = target ? target.getAttribute('data-kind') : '';
            var id = target ? target.getAttribute('data-id') : '';
            var feet = clientToFeet(event.clientX, event.clientY);

            if (kind === 'remove') {
                if (findItem(id)) {
                    state.selected = { type: 'item', id: id };
                } else if (findStair(id)) {
                    state.selected = { type: 'stair', id: id };
                } else if (findOpening(id)) {
                    state.selected = { type: 'opening', id: id };
                }
                deleteSelected();
                event.preventDefault();
                return;
            }

            if (kind === 'rotate') {
                if (findStair(id)) {
                    turnStair(id);
                    event.preventDefault();
                    return;
                }
                var turning = findItem(id);
                var turnSize;
                if (!turning) {
                    return;
                }
                state.selected = { type: 'item', id: id };
                renderSelection();
                turnSize = footprint(turning);
                drag = {
                    kind: 'rotate',
                    id: id,
                    pointerId: event.pointerId,
                    centerX: turning.x + turnSize.w / 2,
                    centerY: turning.y + turnSize.d / 2,
                    startAngle: Math.atan2(feet.y - (turning.y + turnSize.d / 2), feet.x - (turning.x + turnSize.w / 2)),
                    originRotation: turning.rotation,
                    originX: turning.x,
                    originY: turning.y,
                    goodRotation: turning.rotation,
                    goodX: turning.x,
                    goodY: turning.y,
                    moved: false
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

            if (kind === 'item' || kind === 'stair') {
                var movingPiece = kind === 'item' ? findItem(id) : findStair(id);
                var additive = additivePointer(event);
                var pickedCount;
                if (!movingPiece) {
                    return;
                }
                if (additive && !isPicked(id)) {
                    state.group = pickedList();
                    state.group.push({ type: kind, id: id });
                    state.selected = { type: kind, id: id };
                } else if (additive && pickedList().length > 1) {
                    togglePick(kind, id);
                }
                drag = {
                    kind: 'pack',
                    id: id,
                    pieceType: kind,
                    pointerId: event.pointerId,
                    additive: additive,
                    applied: additive,
                    start: feet,
                    startX: event.clientX,
                    startY: event.clientY,
                    armed: false,
                    moved: false,
                    blocked: false,
                    members: null,
                    goodDx: 0,
                    goodDy: 0
                };
                capturePointer(event);
                event.preventDefault();
                if (additive) {
                    pickedCount = pickedList().length;
                    renderPlan();
                    renderSelection();
                    setStatus(pickedCount > 1 ? pickedCount + ' pieces selected. Drag one to move them together.' : 'Shift-click another piece to add it.');
                }
                return;
            }

            if (kind === 'opening') {
                var opening = findOpening(id);
                var wall = opening && findWall(opening.wall);
                if (!opening || !wall) {
                    return;
                }
                selectOnly('opening', id);
                renderSelection();
                renderPlan();
                drag = {
                    kind: 'opening',
                    id: id,
                    pointerId: event.pointerId,
                    grab: project(wall, feet.x, feet.y) - opening.offset
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }


            if ((state.tool === 'stair' || state.tool === 'stair-down') && kind !== 'item' && kind !== 'opening') {
                drag = {
                    kind: 'place-stair',
                    pointerId: event.pointerId,
                    startX: event.clientX,
                    startY: event.clientY
                };
                capturePointer(event);
                return;
            }

            if (state.tool === 'door' || state.tool === 'doorway' || state.tool === 'window') {
                drag = {
                    kind: 'place-door',
                    pointerId: event.pointerId,
                    startX: event.clientX,
                    startY: event.clientY
                };
                capturePointer(event);
                return;
            }

            if (state.tool === 'wall' && kind !== 'item' && kind !== 'opening') {
                drag = {
                    kind: 'draw-wall',
                    pointerId: event.pointerId,
                    start: snapDrawPoint(feet.x, feet.y),
                    moved: false
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

            if (kind === 'wall-curve') {
                ensureCustom();
                if (!findSegment(id)) {
                    return;
                }
                drag = {
                    kind: 'wall-curve',
                    id: id,
                    pointerId: event.pointerId,
                    snapshot: cloneSegments(state.room.segments),
                    goodState: captureRoomState(),
                    moved: false
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

            if (kind === 'wall' || kind === 'wall-end') {
                var wallSegment;
                ensureCustom();
                wallSegment = findSegment(id);
                if (!wallSegment) {
                    return;
                }
                selectOnly('wall', id);
                renderSelection();
                renderPlan();
                drag = {
                    kind: kind === 'wall-end' ? 'wall-end' : 'wall-body',
                    id: id,
                    end: target.getAttribute('data-end') || '2',
                    pointerId: event.pointerId,
                    start: feet,
                    segment: {
                        id: wallSegment.id,
                        x1: wallSegment.x1,
                        y1: wallSegment.y1,
                        x2: wallSegment.x2,
                        y2: wallSegment.y2
                    },
                    horizontal: Math.abs(wallSegment.y1 - wallSegment.y2) <= 0.001,
                    degree1: endpointDegree(state.room.segments, wallSegment.x1, wallSegment.y1),
                    degree2: endpointDegree(state.room.segments, wallSegment.x2, wallSegment.y2),
                    snapshot: cloneSegments(state.room.segments),
                    itemSnapshot: JSON.parse(JSON.stringify(state.items)),
                    openingSnapshot: JSON.parse(JSON.stringify(state.openings)),
                    goodState: captureRoomState(),
                    rotated: false,
                    moved: false
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

            if (state.tool === 'select' && additivePointer(event)) {
                drag = {
                    kind: 'marquee',
                    pointerId: event.pointerId,
                    start: feet,
                    additive: true,
                    base: pickedList(),
                    moved: false
                };
                capturePointer(event);
                return;
            }
            if (state.tool === 'select') {
                beginPan(event, true);
                return;
            }
            clearPicks();
            renderSelection();
            renderPlan();
        }

        function containingFace(x, y, width, depth) {
            var faces = layout().faces || [];
            var index;
            for (index = 0; index < faces.length; index += 1) {
                if (rectInPolygon(x, y, width, depth, faces[index])) {
                    return faces[index];
                }
            }
            return null;
        }

        function captureMembers() {
            return pickedList().map(function (entry) {
                var obj = entry.type === 'stair' ? findStair(entry.id) : findItem(entry.id);
                var box;
                if (!obj) {
                    return null;
                }
                box = entry.type === 'stair' ? stairBox(obj) : footprint(obj);
                if (entry.type === 'item') {
                    var homeFace = null;
                    var faces = layout().faces || [];
                    var faceIndex;
                    var boxes = occupiedWorld(obj);
                    for (faceIndex = 0; faceIndex < faces.length; faceIndex += 1) {
                        if (boxes.every(function (part) {
                            return rectInPolygon(part.x, part.y, part.w, part.d, faces[faceIndex]);
                        })) {
                            homeFace = faces[faceIndex];
                            break;
                        }
                    }
                    return {
                        type: entry.type,
                        id: entry.id,
                        obj: obj,
                        ox: obj.x,
                        oy: obj.y,
                        home: homeFace
                    };
                }
                return {
                    type: entry.type,
                    id: entry.id,
                    obj: obj,
                    ox: obj.x,
                    oy: obj.y,
                    home: containingFace(obj.x, obj.y, box.w, box.d)
                };
            }).filter(function (member) {
                return !!member;
            });
        }

        function memberIgnore(members) {
            var ignore = {};
            members.forEach(function (member) {
                ignore[member.id] = true;
            });
            return ignore;
        }

        function membersClear(members) {
            var ignore = memberIgnore(members);
            var index;
            for (index = 0; index < members.length; index += 1) {
                var member = members[index];
                var box = member.type === 'stair' ? stairBox(member.obj) : null;
                var parts = member.type === 'item' ? occupiedWorld(member.obj) : [];
                if (member.home && member.type === 'stair' && !rectInPolygon(member.obj.x, member.obj.y, box.w, box.d, member.home)) {
                    return false;
                }
                if (member.home && member.type === 'item' && parts.some(function (part) {
                    return !rectInPolygon(part.x, part.y, part.w, part.d, member.home);
                })) {
                    return false;
                }
                if (member.type === 'stair') {
                    if (!stairInside(member.obj, ignore)) {
                        return false;
                    }
                } else if (!itemInside(member.obj, ignore)) {
                    return false;
                }
            }
            return true;
        }

        function placeMembers(members, dx, dy) {
            members.forEach(function (member) {
                member.obj.x = Math.round((member.ox + dx) * 100) / 100;
                member.obj.y = Math.round((member.oy + dy) * 100) / 100;
            });
        }

        function memberHitsSolid(member, ignore) {
            var box;
            var rug = member.type === 'item' && isRugItem(member.obj);
            if (member.type === 'item') {
                if (itemOverlaps(member.obj, ignore)) {
                    return true;
                }
                if (rug) {
                    return false;
                }
                return itemBlocksPassage(member.obj);
            }
            box = stairBox(member.obj);
            if (overlapsPieces(member.obj.x, member.obj.y, box.w, box.d, member.id, false, ignore)) {
                return true;
            }
            return coversPassage(member.obj.x, member.obj.y, box.w, box.d);
        }

        function clampMembers(members, from, to, other, horizontal) {
            var best = from;
            var lo = 0;
            var hi = 1;
            var step;
            var candidate;
            placeMembers(members, horizontal ? to : other, horizontal ? other : to);
            if (membersClear(members)) {
                return to;
            }
            for (step = 0; step < 12; step += 1) {
                candidate = from + (to - from) * ((lo + hi) / 2);
                placeMembers(members, horizontal ? candidate : other, horizontal ? other : candidate);
                if (membersClear(members)) {
                    best = candidate;
                    lo = (lo + hi) / 2;
                } else {
                    hi = (lo + hi) / 2;
                }
            }
            placeMembers(members, horizontal ? best : other, horizontal ? other : best);
            return best;
        }

        function slideMembers(members, dx, dy) {
            var ignore;
            var nextX;
            var nextY;
            if (!members.length) {
                return;
            }
            placeMembers(members, dx, dy);
            if (membersClear(members)) {
                drag.goodDx = dx;
                drag.goodDy = dy;
                drag.blocked = false;
                drag.walled = false;
                drag.outside = false;
                return;
            }
            ignore = memberIgnore(members);
            drag.blocked = members.some(function (member) {
                return memberHitsSolid(member, ignore);
            });
            drag.walled = members.some(function (member) {
                var box = member.type === 'stair' ? stairBox(member.obj) : footprint(member.obj);
                return member.home && !rectInPolygon(member.obj.x, member.obj.y, box.w, box.d, member.home);
            });
            drag.outside = !drag.blocked && !drag.walled;
            nextX = clampMembers(members, drag.goodDx, dx, drag.goodDy, true);
            nextY = clampMembers(members, drag.goodDy, dy, nextX, false);
            drag.goodDx = nextX;
            drag.goodDy = nextY;
        }

        function finishPack(current) {
            var snapped;
            if (!current.moved) {
                if (!current.applied) {
                    if (current.additive) {
                        togglePick(current.pieceType, current.id);
                    } else {
                        selectOnly(current.pieceType, current.id);
                    }
                }
                renderPlan();
                renderSelection();
                if (current.additive && pickedList().length > 1) {
                    setStatus(pickedList().length + ' pieces selected. Drag one to move them together.');
                }
                return;
            }
            if (!current.members) {
                return;
            }
            snapped = current.members.map(function (member) {
                return { x: member.obj.x, y: member.obj.y };
            });
            current.members.forEach(function (member) {
                member.obj.x = Math.round(member.obj.x * 4) / 4;
                member.obj.y = Math.round(member.obj.y * 4) / 4;
            });
            if (!membersClear(current.members)) {
                current.members.forEach(function (member, index) {
                    member.obj.x = snapped[index].x;
                    member.obj.y = snapped[index].y;
                });
            }
            current.members.forEach(function (member) {
                if (member.type === 'stair') {
                    mirrorStair(member.obj, false);
                }
            });
            persist();
            renderPlan();
            renderSelection();
            setStatus(current.blocked ? 'That spot is taken.' : (current.walled ? 'Pieces stay in their room.' : (current.outside ? 'Pieces stay inside the house.' : '')));
        }

        function marqueeRect(start, end) {
            var x = Math.min(start.x, end.x);
            var y = Math.min(start.y, end.y);
            return {
                x: x,
                y: y,
                w: Math.abs(end.x - start.x),
                d: Math.abs(end.y - start.y)
            };
        }

        function piecesTouching(rect) {
            var hits = [];
            state.items.forEach(function (item) {
                var size = footprint(item);
                if (rectsOverlap(rect.x, rect.y, rect.w, rect.d, item.x, item.y, size.w, size.d)) {
                    hits.push({ type: 'item', id: item.id });
                }
            });
            (state.stairs || []).forEach(function (stair) {
                var box = stairBox(stair);
                if (rectsOverlap(rect.x, rect.y, rect.w, rect.d, stair.x, stair.y, box.w, box.d)) {
                    hits.push({ type: 'stair', id: stair.id });
                }
            });
            return hits;
        }

        function showMarquee(start, end) {
            var rect = marqueeRect(start, end);
            var node = svg.querySelector('.room-builder__marquee');
            if (!node) {
                node = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                node.setAttribute('class', 'room-builder__marquee');
                node.setAttribute('pointer-events', 'none');
                svg.appendChild(node);
            }
            node.setAttribute('x', num(rect.x));
            node.setAttribute('y', num(rect.y));
            node.setAttribute('width', num(rect.w));
            node.setAttribute('height', num(rect.d));
        }

        function finishMarquee(current, end) {
            var node = svg.querySelector('.room-builder__marquee');
            var hits;
            var seen = {};
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
            if (!current.moved) {
                if (!current.additive) {
                    clearPicks();
                }
                renderPlan();
                renderSelection();
                return;
            }
            hits = current.additive ? current.base.slice() : [];
            hits.forEach(function (entry) {
                seen[entry.id] = true;
            });
            piecesTouching(marqueeRect(current.start, end)).forEach(function (entry) {
                if (!seen[entry.id]) {
                    hits.push(entry);
                    seen[entry.id] = true;
                }
            });
            state.group = hits;
            state.selected = hits.length ? { type: hits[hits.length - 1].type, id: hits[hits.length - 1].id } : null;
            renderPlan();
            renderSelection();
            if (hits.length > 1) {
                setStatus(hits.length + ' pieces selected. Drag one to move them together.');
            } else {
                setStatus('');
            }
        }

        function clampInside(item, from, to, fixed, horizontal) {
            var best = from;
            var lo = 0;
            var hi = 1;
            var step;
            var candidate;
            item.x = horizontal ? to : fixed;
            item.y = horizontal ? fixed : to;
            if (itemInside(item)) {
                return to;
            }
            for (step = 0; step < 12; step += 1) {
                candidate = from + (to - from) * ((lo + hi) / 2);
                item.x = horizontal ? candidate : fixed;
                item.y = horizontal ? fixed : candidate;
                if (itemInside(item)) {
                    best = candidate;
                    lo = (lo + hi) / 2;
                } else {
                    hi = (lo + hi) / 2;
                }
            }
            item.x = horizontal ? best : fixed;
            item.y = horizontal ? fixed : best;
            return best;
        }

        function slideItem(item, x, y) {
            var lastX = drag.lastX;
            var lastY = drag.lastY;
            item.x = x;
            item.y = y;
            if (itemInside(item)) {
                drag.lastX = item.x;
                drag.lastY = item.y;
                return;
            }
            item.x = clampInside(item, lastX, x, lastY, true);
            item.y = lastY;
            item.y = clampInside(item, lastY, y, item.x, false);
            drag.lastX = item.x;
            drag.lastY = item.y;
        }

        function syncDraggedItem(item) {
            var node = svg.querySelector('[data-kind="item"][data-id="' + item.id + '"]');
            var box = svg.querySelector('.room-builder__pick.is-primary');
            var handle = svg.querySelector('[data-kind="rotate"]');
            var size = footprint(item);
            var point = rotateHandlePoint(item);
            if (!node || !box || !handle) {
                renderPlan();
                return;
            }
            node.setAttribute('transform', itemTransform(item));
            box.setAttribute('x', num(item.x - 0.1));
            box.setAttribute('y', num(item.y - 0.1));
            box.setAttribute('width', num(size.w + 0.2));
            box.setAttribute('height', num(size.d + 0.2));
            handle.setAttribute('transform', 'translate(' + num(point.x) + ' ' + num(point.y) + ')');
            var remove = svg.querySelector('[data-kind="remove"]');
            if (remove) {
                remove.setAttribute('transform', 'translate(' + num(item.x + size.w + 0.08) + ' ' + num(item.y - 0.08) + ')');
            }
        }

        function onPlanPointerMove(event) {
            if (!drag || drag.pointerId !== event.pointerId) {
                return;
            }
            if (drag.kind === 'draw-wall') {
                var drawEnd = drawnEnd(drag.start, clientToFeet(event.clientX, event.clientY));
                var drawLength = Math.hypot(drawEnd.x - drag.start.x, drawEnd.y - drag.start.y);
                drag.moved = drawLength >= 0.25;
                showDrawPreview(drag.start, drawEnd, drawLength);
                return;
            }
            if (drag.kind === 'rotate') {
                var spinning = findItem(drag.id);
                var spinFeet = clientToFeet(event.clientX, event.clientY);
                var spinAngle;
                var spinDelta;
                var spinNext;
                if (!spinning) {
                    return;
                }
                spinAngle = Math.atan2(spinFeet.y - drag.centerY, spinFeet.x - drag.centerX);
                spinDelta = spinAngle - drag.startAngle;
                while (spinDelta > Math.PI) {
                    spinDelta -= Math.PI * 2;
                }
                while (spinDelta < -Math.PI) {
                    spinDelta += Math.PI * 2;
                }
                if (Math.abs(spinDelta) > 0.03) {
                    drag.moved = true;
                }
                spinNext = drag.originRotation + spinDelta * (180 / Math.PI);
                spinning.rotation = drag.originRotation;
                spinning.x = drag.originX;
                spinning.y = drag.originY;
                if (turnItem(spinning, spinNext, drag.centerX, drag.centerY)) {
                    drag.goodRotation = spinning.rotation;
                    drag.goodX = spinning.x;
                    drag.goodY = spinning.y;
                } else {
                    spinning.rotation = drag.goodRotation;
                    spinning.x = drag.goodX;
                    spinning.y = drag.goodY;
                }
                syncDraggedItem(spinning);
                return;
            }
            if (drag.kind === 'pan') {
                movePan(event);
                return;
            }
            if (drag.kind === 'marquee') {
                var marqueeFeet = clientToFeet(event.clientX, event.clientY);
                if (Math.abs(marqueeFeet.x - drag.start.x) > 0.2 || Math.abs(marqueeFeet.y - drag.start.y) > 0.2) {
                    drag.moved = true;
                }
                showMarquee(drag.start, marqueeFeet);
                return;
            }
            if (drag.kind === 'pack') {
                var packFeet = clientToFeet(event.clientX, event.clientY);
                var packDx;
                var packDy;
                if (Math.abs(event.clientX - drag.startX) > 8 || Math.abs(event.clientY - drag.startY) > 8) {
                    drag.moved = true;
                }
                if (!drag.moved) {
                    return;
                }
                if (!drag.armed) {
                    drag.armed = true;
                    if (!drag.applied) {
                        if (drag.additive && !isPicked(drag.id)) {
                            state.group = pickedList();
                            state.group.push({ type: drag.pieceType, id: drag.id });
                            state.selected = { type: drag.pieceType, id: drag.id };
                        } else if (!drag.additive && !isPicked(drag.id)) {
                            selectOnly(drag.pieceType, drag.id);
                        }
                    }
                    drag.members = captureMembers();
                    drag.goodDx = 0;
                    drag.goodDy = 0;
                    renderPlan();
                    renderSelection();
                }
                packDx = packFeet.x - drag.start.x;
                packDy = packFeet.y - drag.start.y;
                slideMembers(drag.members, packDx, packDy);
                if (drag.members.length === 1 && drag.members[0].type === 'item') {
                    syncDraggedItem(drag.members[0].obj);
                } else {
                    renderPlan();
                }
                return;
            }
            if (drag.kind === 'opening') {
                var opening = findOpening(drag.id);
                var wall = opening && findWall(opening.wall);
                if (!opening || !wall) {
                    return;
                }
                var point = clientToFeet(event.clientX, event.clientY);
                var desired = snap(project(wall, point.x, point.y) - drag.grab);
                desired = Math.max(0, Math.min(desired, wall.length - opening.width));
                if (!overlapsOpening(opening.wall, desired, opening.width, opening.id)) {
                    var previousOffset = opening.offset;
                    opening.offset = desired;
                    if (openingBlockedByFurniture(opening)) {
                        opening.offset = previousOffset;
                        return;
                    }
                    renderPlan();
                }
                return;
            }
            if (drag.kind === 'wall-curve') {
                previewCurveDrag(clientToFeet(event.clientX, event.clientY));
                return;
            }
            if (drag.kind === 'wall-body' || drag.kind === 'wall-end') {
                var wallFeet = clientToFeet(event.clientX, event.clientY);
                if (Math.abs(wallFeet.x - drag.start.x) > 0.2 || Math.abs(wallFeet.y - drag.start.y) > 0.2) {
                    drag.moved = true;
                }
                previewWallDrag(wallFeet);
            }
        }

        function onPlanPointerUp(event) {
            if (!drag || drag.pointerId !== event.pointerId) {
                return;
            }
            if (drag.kind === 'shape' || drag.kind === 'wall-piece' || drag.kind === 'palette' || drag.kind === 'custom-wall') {
                return;
            }
            var current = drag;
            drag = null;
            if (current.kind === 'draw-wall') {
                var finished = drawnEnd(current.start, clientToFeet(event.clientX, event.clientY));
                var finishedLength = Math.hypot(finished.x - current.start.x, finished.y - current.start.y);
                clearDrawPreview();
                if (finishedLength >= MIN_WALL - 0.001) {
                    placeDrawnWall(current.start, finished);
                }
                return;
            }
            if (current.kind === 'place-door') {
                var moved = Math.abs(event.clientX - current.startX) > 5 || Math.abs(event.clientY - current.startY) > 5;
                if (!moved) {
                    placeDoor(clientToFeet(event.clientX, event.clientY));
                }
                return;
            }
            if (current.kind === 'place-stair') {
                var stairMoved = Math.abs(event.clientX - current.startX) > 5 || Math.abs(event.clientY - current.startY) > 5;
                if (!stairMoved) {
                    placeStair(clientToFeet(event.clientX, event.clientY));
                }
                return;
            }
            if (current.kind === 'pan') {
                endPan(current);
                return;
            }
            if (current.kind === 'marquee') {
                finishMarquee(current, clientToFeet(event.clientX, event.clientY));
                return;
            }
            if (current.kind === 'pack') {
                finishPack(current);
                return;
            }
            if (current.kind === 'wall-curve') {
                if (current.moved) {
                    persist();
                    renderPlan();
                    renderSelection();
                    setStatus('Wall curved. Drag the curve handle to change the bow.');
                }
                return;
            }
            if (current.kind === 'wall-body' || current.kind === 'wall-end') {
                if (current.moved) {
                    var closedBeforeSnap = state.room.points && state.room.points.length >= 4;
                    var beforeSnap = captureRoomState();
                    snapDraggedWall(current, clientToFeet(event.clientX, event.clientY));
                    syncFromSegments(true);
                    if (closedBeforeSnap && (!state.room.points || state.room.points.length < 4)) {
                        restoreRoomState(beforeSnap);
                    }
                    persist();
                    renderPlan();
                    renderSelection();
                    if (!(state.room.points && state.room.points.length >= 4)) {
                        setStatus('Connect the open ends to close the room.');
                    } else if (JSON.stringify(state.room.segments) === JSON.stringify(current.snapshot)) {
                        setStatus('');
                    } else {
                        setStatus('Room updated.');
                    }
                }
                return;
            }
            if (current.kind === 'rotate') {
                var turned = findItem(current.id);
                if (turned && !current.moved && !turnItem(turned, current.originRotation + 90, current.centerX, current.centerY, true)) {
                    setStatus(catalogItem(turned.catalogId).name + ' does not fit that way.');
                } else if (turned && turned.rotation !== current.originRotation) {
                    var turnedSize = footprint(turned);
                    var shifted = Math.abs(turned.x + turnedSize.w / 2 - current.centerX) > 0.2 || Math.abs(turned.y + turnedSize.d / 2 - current.centerY) > 0.2;
                    if (current.moved) {
                        setStatus('Turned to ' + turned.rotation + '°.' + (shifted ? ' Shifted so it stays inside the room.' : ''));
                    } else {
                        setStatus(shifted ? 'Turned 90° and shifted so it stays inside the room.' : 'Turned 90°.');
                    }
                } else {
                    setStatus('');
                }
                persist();
                renderPlan();
                renderSelection();
                return;
            }
            if (current.kind === 'item') {
                var dropped = findItem(current.id);
                var freeX;
                var freeY;
                if (dropped) {
                    freeX = dropped.x;
                    freeY = dropped.y;
                    dropped.x = Math.round(dropped.x * 4) / 4;
                    dropped.y = Math.round(dropped.y * 4) / 4;
                    if (!itemInside(dropped)) {
                        dropped.x = freeX;
                        dropped.y = freeY;
                    }
                }
                persist();
                renderPlan();
                renderSelection();
                return;
            }
            if (current.kind === 'opening') {
                persist();
            }
        }

        function onCustomWallPointerDown(event) {
            if (event.button !== 0) {
                return;
            }
            drag = {
                kind: 'custom-wall',
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                moved: false,
                drawStart: null
            };
            holdPointer(event);
        }

        function onCustomWallPointerMove(event) {
            var bounds;
            var feet;
            var end;
            var length;
            if (!drag || drag.kind !== 'custom-wall' || drag.pointerId !== event.pointerId) {
                return;
            }
            if (Math.abs(event.clientX - drag.startX) > 6 || Math.abs(event.clientY - drag.startY) > 6) {
                drag.moved = true;
                ensureGhost('Custom wall', event.clientX, event.clientY);
            }
            if (!drag.moved) {
                return;
            }
            bounds = stage.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
                clearDrawPreview();
                return;
            }
            feet = clientToFeet(event.clientX, event.clientY);
            if (!drag.drawStart) {
                drag.drawStart = snapDrawPoint(feet.x, feet.y);
            }
            end = drawnEnd(drag.drawStart, feet);
            length = Math.hypot(end.x - drag.drawStart.x, end.y - drag.drawStart.y);
            showDrawPreview(drag.drawStart, end, length);
        }

        function onCustomWallPointerUp(event) {
            var current;
            var feet;
            var end;
            var length;
            if (!drag || drag.kind !== 'custom-wall' || drag.pointerId !== event.pointerId) {
                return;
            }
            current = drag;
            drag = null;
            removeGhost();
            clearDrawPreview();
            if (!current.moved) {
                state.tool = state.tool === 'wall' ? 'select' : 'wall';
                syncDoorTool();
                setStatus(state.tool === 'wall' ? 'Drag across the plan to draw a wall.' : '');
                return;
            }
            if (!current.drawStart) {
                setStatus('Drag across the plan to draw a wall.');
                return;
            }
            feet = clientToFeet(event.clientX, event.clientY);
            end = drawnEnd(current.drawStart, feet);
            length = Math.hypot(end.x - current.drawStart.x, end.y - current.drawStart.y);
            if (length < MIN_WALL - 0.001) {
                setStatus('Drag a little farther so the wall is at least ' + MIN_WALL + ' ft.');
                return;
            }
            placeDrawnWall(current.drawStart, end);
        }

        function onWallPointerDown(event) {
            if (event.button !== 0) {
                return;
            }
            drag = {
                kind: 'wall-piece',
                length: Number(event.currentTarget.getAttribute('data-wall-length')),
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                moved: false,
                vertical: false
            };
            holdPointer(event);
        }

        function onWallPointerMove(event) {
            if (!drag || drag.kind !== 'wall-piece' || drag.pointerId !== event.pointerId) {
                return;
            }
            if (Math.abs(event.clientX - drag.startX) > 5 || Math.abs(event.clientY - drag.startY) > 5) {
                drag.moved = true;
                drag.vertical = Math.abs(event.clientY - drag.startY) > Math.abs(event.clientX - drag.startX);
                ensureGhost(drag.length + ' ft wall', event.clientX, event.clientY);
            }
        }

        function onWallPointerUp(event) {
            if (!drag || drag.kind !== 'wall-piece' || drag.pointerId !== event.pointerId) {
                return;
            }
            var current = drag;
            var bounds;
            var overPlan;
            drag = null;
            removeGhost();
            if (!current.moved) {
                placeWallPiece(current.length, false, null);
                return;
            }
            bounds = stage.getBoundingClientRect();
            overPlan = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
            if (!overPlan) {
                return;
            }
            placeWallPiece(current.length, current.vertical, clientToFeet(event.clientX, event.clientY));
        }

        function onPalettePointerDown(event) {
            if (event.button !== 0) {
                return;
            }
            drag = {
                kind: 'palette',
                catalogId: event.currentTarget.getAttribute('data-catalog'),
                width: parseFloat(event.currentTarget.getAttribute('data-width')),
                depth: parseFloat(event.currentTarget.getAttribute('data-depth')),
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                moved: false
            };
            holdPointer(event);
        }

        function onPalettePointerMove(event) {
            if (!drag || drag.kind !== 'palette' || drag.pointerId !== event.pointerId) {
                return;
            }
            if (Math.abs(event.clientX - drag.startX) > 5 || Math.abs(event.clientY - drag.startY) > 5) {
                drag.moved = true;
                ensureGhost(catalogItem(drag.catalogId).name, event.clientX, event.clientY);
            }
        }

        function onPalettePointerUp(event) {
            if (!drag || drag.kind !== 'palette' || drag.pointerId !== event.pointerId) {
                return;
            }
            var current = drag;
            drag = null;
            removeGhost();
            if (!current.moved) {
                placeItem(current.catalogId, null, { width: current.width, depth: current.depth });
                return;
            }
            var bounds = stage.getBoundingClientRect();
            var overPlan = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
            if (!overPlan) {
                return;
            }
            var feet = clientToFeet(event.clientX, event.clientY);
            var size = footprint({ catalogId: current.catalogId, rotation: 0, width: current.width, depth: current.depth });
            placeItem(current.catalogId, {
                x: feet.x - size.w / 2,
                y: feet.y - size.d / 2
            }, { width: current.width, depth: current.depth });
        }

        function ensureGhost(name, clientX, clientY) {
            if (!ghost) {
                ghost = document.createElement('div');
                ghost.className = 'room-builder__ghost';
                ghost.textContent = name;
                document.body.appendChild(ghost);
            }
            ghost.style.left = clientX + 'px';
            ghost.style.top = clientY + 'px';
        }

        function removeGhost() {
            if (ghost && ghost.parentNode) {
                ghost.parentNode.removeChild(ghost);
            }
            ghost = null;
        }

        function onKeyDown(event) {
            if ((event.ctrlKey || event.metaKey) && (event.key === 'z' || event.key === 'Z') && !event.shiftKey) {
                var typing = event.target && event.target.tagName;
                if (modal && !modal.hidden) {
                    return;
                }
                if (typing === 'INPUT' || typing === 'TEXTAREA' || typing === 'SELECT') {
                    return;
                }
                undo();
                event.preventDefault();
                return;
            }
            if (modal && !modal.hidden) {
                if (event.key === 'Escape') {
                    closeModal();
                    event.preventDefault();
                }
                return;
            }
            if (!root.contains(event.target)) {
                return;
            }
            var tag = event.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                return;
            }
            if (event.key === 'Escape' && view3dOn) {
                toggleView3d(false);
                event.preventDefault();
                return;
            }
            if (event.key === 'Escape' && (state.tool === 'door' || state.tool === 'doorway' || state.tool === 'window' || state.tool === 'stair' || state.tool === 'stair-down' || state.tool === 'wall')) {
                state.tool = 'select';
                syncDoorTool();
                setStatus('');
                event.preventDefault();
                return;
            }
            if ((event.key === 'r' || event.key === 'R') && state.selected && state.selected.type === 'item') {
                rotateSelected(event.shiftKey ? 180 : 90);
                event.preventDefault();
                return;
            }
            if ((event.key === 'Delete' || event.key === 'Backspace') && state.selected) {
                deleteSelected();
                event.preventDefault();
            }
        }
    }
})();
