/**
 * @class       Line
 * Define method for lines and curves
 */

function Line() {
	const ERROR = 0.00001
}

Line.prototype.distance = function(line2){
	var d = 0
	if(!this.intersects$U(line2)){
		// Al ser paralelas la distancia entre rectas se convierte a una distancia entre un punto y una recta.
		//                         __   _     _
		//dist(P,r) = Area/Base = |RP x d| / |d|
		var RP = new Vector(this.v1.get_coord(0) - line2.v1.get_coord(0), this.v1.get_coord(1) - line2.v1.get_coord(1), 0)
		var d = new Vector(this.v1.get_coord(0) - this.v2.get_coord(0), this.v1.get_coord(1) - this.v2.get_coord(1), 0)
		var RP_module = RP.cross(d).module() 
		var d_module = d.module()
		d = RP_module / d_module
	}
	return d
}

Line.prototype.get_intersection = function(){

}

Line.prototype.intersects$U = function(line2){
	m1 = pendiente_recta(this)
	m2 = pendiente_recta(line2)
	if(m1 === m2)
		return false // Son paralelas
	return true
}

function pendiente_recta(line){
	var m = (line.v2.get_coord(1) - line.v1.get_coord(1)) / (line.v2.get_coord(0) - line.v1.get_coord(0))
	return m
}

Line.prototype.get_initial_point = function() {
	throw "virtual function invocation: Please define get_initial_point():Vector"
}

Line.prototype.get_final_point = function() {
	throw "virtual function invocation: Please define get_final_point():Vector"
}

Line.prototype.at = function() {
	throw "virtual function invocation: Please define at(lambda:Number):Vector"
}

Line.prototype.get_arc_length = function() {
	//Note: lambda = lambda || 1
	throw "virtual function invocation: Please define get_arc_length([lambda:Number=1]):Number"
}

Line.prototype.get_tangent = function() {
	throw "virtual function invocation: Please define get_tangent(lambda:Number):Vector"
}

Line.prototype.get_normal = function() {
	throw "virtual function invocation: Please define get_normal(lambda:Number):Vector"
}

Line.prototype.get_perpendicular = function() {
	throw "virtual function invocation: Please define get_perpendicular([point:Vector | iterator:Number]):StraightLine"
}

Line.prototype.belongs_to = function() {
	throw "virtual function invocation: Please define belongs_to(point:Vector):Boolean"
}

Line.prototype.intersects = function() {
	throw "virtual function invocation: Please define intersects(line:Line):Boolean"
}

Line.prototype.get_intersection = function() {
	throw "virtual function invocation: Please define get_intersection(line:Line):Vector"
}