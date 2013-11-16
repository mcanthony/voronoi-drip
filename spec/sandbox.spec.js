describe("a Sandbox", function() {
    var sandbox,
        container,
        startAllLink;

    beforeEach(function() {
        container = document.createElement('div');
        sandbox = VoronoiDrip.Sandbox.create({
            container: container
        });
    });

    describe("when start is called", function() {

        beforeEach(function() {
            sandbox.start();
            startAllLink = container.getElementsByClassName('sandbox-start-all')[0];
        });

        it("creates a start all link", function() {
            expect(startAllLink.innerHTML).toBe('Start all');
            expect(startAllLink.getAttribute('href')).toBe('#');
        });

        describe("when add is called", function() {

            var spec,
                dripContainer,
                startLink,
                mockDrip;

            beforeEach(function() {
                spec = {
                    width: 300,
                    height: 300,
                    gravity: 10,
                    timeout: 100,
                    startVolume: 33,
                    network: [
                        {
                            va: {x: 150, y: 200},
                            vb: {x: 250, y: 250},
                            ca: null,
                            cb: [1],
                        },{
                            va: {x: 250, y: 250},
                            vb: {x: 250, y: 300},
                            ca: [0],
                            cb: null,
                        }
                    ]
                };
                mockDrip = jasmine.createSpyObj('voronoiDrip', ['start', 'addFluid']);
                spyOn(VoronoiDrip, 'create').andReturn(mockDrip);
                sandbox.add(spec);
                dripContainer = container.getElementsByClassName('sandbox-voronoi-drip')[0];
                startLink = dripContainer.getElementsByClassName('sandbox-start')[0];
            });

            it("creates a new voronoi drip", function() {
                expect(VoronoiDrip.create).toHaveBeenCalled();
            });

            it("creates a container for the new voronoi drip", function() {
                expect(container.getElementsByClassName('sandbox-voronoi-drip').length).toBe(1);
            });

            it("passes the container and spec to the new voronoi drip", function() {
                expect(VoronoiDrip.create).toHaveBeenCalledWith(spec);
                expect(spec.container).toBe(dripContainer);
            });

            it("starts the new voronoi drip", function() {
                expect(mockDrip.start).toHaveBeenCalled();
            });

            it("creates a start link for the new voronoi drip", function() {
                expect(startLink.innerHTML).toBe('Start');
                expect(startLink.getAttribute('href')).toBe('#');
            });

            it("adds the specified fluid when the start link is clicked", function() {
                startLink.click();
                expect(mockDrip.addFluid).toHaveBeenCalledWith(spec.startVolume);
            });

            describe("when add is called again", function() {

                var anotherSpec,
                    anotherDripContainer,
                    anotherStartLink,
                    anotherMockDrip;

                beforeEach(function() {
                    anotherSpec = {
                        startVolume: 200
                    };
                    anotherMockDrip = jasmine.createSpyObj('voronoiDrip', ['start', 'addFluid']);
                    VoronoiDrip.create.andReturn(anotherMockDrip);
                    sandbox.add(anotherSpec);
                    anotherDripContainer = container.getElementsByClassName('sandbox-voronoi-drip')[1];
                    anotherStartLink = anotherDripContainer.getElementsByClassName('sandbox-start')[0];
                });

                it("creates a new voronoi drip", function() {
                    expect(VoronoiDrip.create).toHaveBeenCalled();
                });

                it("creates a container for the new voronoi drip", function() {
                    expect(container.getElementsByClassName('sandbox-voronoi-drip').length).toBe(2);
                });

                it("passes the container and spec to the new voronoi drip", function() {
                    expect(VoronoiDrip.create).toHaveBeenCalledWith(anotherSpec);
                    expect(anotherSpec.container).toBe(anotherDripContainer);
                });

                it("starts the new voronoi drip", function() {
                    expect(anotherMockDrip.start).toHaveBeenCalled();
                });

                it("creates a start link for the new voronoi drip", function() {
                    expect(anotherStartLink.innerHTML).toBe('Start');
                    expect(anotherStartLink.getAttribute('href')).toBe('#');
                });

                it("adds the specified fluid when the start link is clicked", function() {
                    anotherStartLink.click();
                    expect(anotherMockDrip.addFluid).toHaveBeenCalledWith(anotherSpec.startVolume);
                });

                describe("when the start all link is clicked", function() {

                    beforeEach(function() {
                        startAllLink.click();
                    });

                    it("adds the specified fluid to all voronoi drips", function() {
                        expect(mockDrip.addFluid).toHaveBeenCalledWith(spec.startVolume);
                        expect(anotherMockDrip.addFluid).toHaveBeenCalledWith(anotherSpec.startVolume);
                    });

                });
            });
        });
    });
});