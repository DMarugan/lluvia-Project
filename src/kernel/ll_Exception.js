MethodMissingError.prototype = new Error
MethodMissingError.prototype.constructor = MethodMissingError

function MethodMissingError(){
  Error.apply(this, arguments)
  this.name = "MethodMissingError"
}

Exception.prototype.constructor = Exception

function Exception(){
  
}

Exception.is$U = function(err, type){
  var error_with = false

  if ( /function call/i.test(type) ){
    error_with = err.toString().match(/ReferenceError:\s*([^\.]+)\s+is not defined.*/)
    if (error_with)
      error_with = error_with[1]
    else throw(err);
    }
  if ( /method call/i.test(type) )
    error_with = err.toString().match(/TypeError:\s*([^\.]+)\.([^\.]+)\s+is not a function.*/)

  if ( /singleton method/i.test(type) )
    error_with = err.toString().match(/\s*([^\.]+)\.([^\.]+)\s+is undefined.*/)
  return error_with
}

Exception.closures = 0

Exception.parse = function(err){
/* Catch scoped calls*/
   var obj = null
   var m = err.toString().match(/TypeError:\s*([^\.]+)\.([^\s]*)\s+is not a function.*/)
   if ( m && (m.length == 3) )
     if ( (obj = eval(m[1])) instanceof Object){
      
      var src = (new JavascriptSource(err.fileName)).code_from(err.lineNumber-1)
      var params  = new CodeBlockFinder( src, m[1] + "." + m[2], {open:'(', close: ')'}).start()
      params = params.substr(0, params.length-1)  // Rip parenthesis


      // var actual_parameters = Expression.parse( params.substr(1) )
      // todo: This isn't valid as long as we permit closures with comma separated
      // parameters. Till this is fixed only one param is permitted
       /*
       for (var i=0; i<actual_parameters.length; i++)
         actual_parameters[i] = eval(actual_parameters[i])
       */

       // functions passed as parameters to dynamical methods are just functions
       // not closures.
       // 

      err.stack.split("\n")[0].search(/(.*)@/)
      var scope = eval(RegExp.$1)
      scope.closures = scope.closures || []


      var actual_parameters = CodeBlockFinder.parse_params(params.substr(1))

      for (var i=0; i<actual_parameters.length; i++)
        /* Parenthesis added to evaluate function definitions */
        try{
           actual_parameters[i] = eval( "(" + actual_parameters[i] + ")" )
        } catch(err){
          alert("Error evaluating dynamic parameter:\n" + 
                 err + "\nParameter: " + actual_parameters[i] )
        }

      
      return obj.method_missing(m[2], m[1],  actual_parameters) 
     }

/* catch global calls */
   var obj = null

   var m = err.toString().match(/ReferenceError:\s*([^\.]+)\s+is not defined.*/)
   if ( m && (m.length == 2) ){

       var stack_line = err.stack.split('\n')[2]
       var params = ""
       var braces = 1 
       var opened = 0

       var init = stack_line.indexOf(m[1]) + m[1].length

       for( var i= init; i<stack_line.length && braces; i++){
              if (stack_line[i] == '(')
                if (opened == 0) opened = -1; else braces++;
              if (stack_line[i] == ')') braces--
              if (opened && braces) params += stack_line[i]
            }

       return method_missing(err, m[1], Expression.parse( params.substr(1) ) )
      }

/* catch singleton methods */
   var obj = null

   var m = err.toString().match(/\s*([^\.]+)\.([^\.]+)\s+is undefined.*/)
  if ( m && (m.length == 3) )

     if ( (obj = eval(m[1])) instanceof Object){
       var stack_line = err.stack.split('\n')[2]
       var params = ""
       var braces = 1 
       var opened = 0

       var init = stack_line.indexOf(m[2]) + m[2].length

       for( var i= init; i<stack_line.length && braces; i++){
              if (stack_line[i] == '(')
                if (opened == 0) opened = -1; else braces++;
              if (stack_line[i] == ')') braces--
              if (opened && braces) params += stack_line[i]
            }

       var actual_parameters = Expression.parse( params.substr(1) )
       for (var i=0; i<actual_parameters.length; i++)
         actual_parameters[i] = eval(actual_parameters[i])

       return obj.method_missing(m[2], m[1],  actual_parameters)
     }

     throw(err)
}

/*
  todo: please, refactor Exception. Be DRY and support multiple browsers! 
  todo: implement begin rescue

  motivation: try catch blocks takes precedence over the last try catch, where method_missing is implemented. In order 
  to use a catch mechanism after the method_missing calls is necessary to develop it.
*/
