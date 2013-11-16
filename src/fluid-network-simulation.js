/*

    Given a network of pipes, simulate fluid moving through them.

    Pipe object:
        va
        vb
            vertex A, and vertex B objects, eg {x: 0, y: 10}
        ca
        cb
            array of indexes for pipes that share vertex A and vertex B respectively

    Initialise with an object containing:
        pipes
            array of Pipe objects
        gravity
            float defaults to 0.1

    Returns the an object with the methods:
        addFluid
            add a volume of fluid to any pipe
        update
            update the simulation
*/

var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.FluidNetworkSimulation = VoronoiDrip.FluidNetworkSimulation || {};

VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME = 0.00001;

VoronoiDrip.FluidNetworkSimulation.create = function(spec) {
    var that = {};

    that.pipes = spec.pipes;
    that.gravity = spec.hasOwnProperty('gravity') ? spec.gravity : 0.1;

    that.addFluid = function(pipe, point, volume) {
        that.fluidAdder.add(pipe, point, volume);
    };

    that.start = function() {
        var fns = VoronoiDrip.FluidNetworkSimulation;
        that.metrics = fns.Metrics.create({
            pipes: that.pipes,
            gravity: that.gravity
        });
        that.metrics.start();
        that.overlapSolver = fns.OverlapSolver.create({
            pipes: that.pipes
        });
        that.fluidAdder = fns.FluidAdder.create({
            pipes: that.pipes,
            metrics: that.metrics,
            overlapSolver: that.overlapSolver
        });
        that.pressureSolver = fns.PressureSolver.create({
            pipes: that.pipes,
            metrics: that.metrics,
            fluidAdder: that.fluidAdder
        });
        that.fluidMover = fns.FluidMover.create({
            pipes: that.pipes,
            metrics: that.metrics,
            pressureSolver: that.pressureSolver
        });
    };

    that.update = function() {
        that.fluidMover.update();
    };

    return that;
};