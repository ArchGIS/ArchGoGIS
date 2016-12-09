describe('After adding markers must zooming to all markers ', () => {
  let object = new App.views.mapControl();

  // it('markers on map', () => {
  //   expect( object.markersOnMap() ).toBe(true)
  // })

  let leftMark = null;
  let rightMark = null;
  let upMark = null;
  let downMark = null;

  let data = {
    left: [38.23, 49.36],
    right: [65.36, 45.35],
    up: [48.5545, 51.65],
    down: [50.655, 48.265]
  }

  it('marker must left', () => {
    expect( object.leftMarker(data) ).toBe(data.left)
  })

  it('marker must right', () => {
    expect( object.rightMarker(data) ).toBe(data.right)
  })

  it('marker must up', () => {
    expect( object.upMarker(data) ).toBe(data.up)
  })

  it('marker must down', () => {
    expect( object.downMarker(data) ).toBe(data.down)
  })

  it('zooming is right', () => {
    expect( zooming() ).toBe(true)
  })
})