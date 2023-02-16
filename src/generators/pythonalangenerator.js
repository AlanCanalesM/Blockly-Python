import * as Blockly from 'blockly';

export const Python = new Blockly.Generator('Python');
const Variables = Blockly.Variables;
const {Names, NameType} = Blockly.Names;


Python.PRECEDENCE = 0;
Python.addReservedWords(
  // import keyword
  // print(','.join(sorted(keyword.kwlist)))
  // https://docs.python.org/3/reference/lexical_analysis.html#keywords
  // https://docs.python.org/2/reference/lexical_analysis.html#keywords
  'False,None,True,and,as,assert,break,class,continue,def,del,elif,else,' +
  'except,exec,finally,for,from,global,if,import,in,is,lambda,nonlocal,not,' +
  'or,pass,print,raise,return,try,while,with,yield,' +
  // https://docs.python.org/3/library/constants.html
  // https://docs.python.org/2/library/constants.html
  'NotImplemented,Ellipsis,__debug__,quit,exit,copyright,license,credits,' +
  // >>> print(','.join(sorted(dir(__builtins__))))
  // https://docs.python.org/3/library/functions.html
  // https://docs.python.org/2/library/functions.html
  'ArithmeticError,AssertionError,AttributeError,BaseException,' +
  'BlockingIOError,BrokenPipeError,BufferError,BytesWarning,' +
  'ChildProcessError,ConnectionAbortedError,ConnectionError,' +
  'ConnectionRefusedError,ConnectionResetError,DeprecationWarning,EOFError,' +
  'Ellipsis,EnvironmentError,Exception,FileExistsError,FileNotFoundError,' +
  'FloatingPointError,FutureWarning,GeneratorExit,IOError,ImportError,' +
  'ImportWarning,IndentationError,IndexError,InterruptedError,' +
  'IsADirectoryError,KeyError,KeyboardInterrupt,LookupError,MemoryError,' +
  'ModuleNotFoundError,NameError,NotADirectoryError,NotImplemented,' +
  'NotImplementedError,OSError,OverflowError,PendingDeprecationWarning,' +
  'PermissionError,ProcessLookupError,RecursionError,ReferenceError,' +
  'ResourceWarning,RuntimeError,RuntimeWarning,StandardError,' +
  'StopAsyncIteration,StopIteration,SyntaxError,SyntaxWarning,SystemError,' +
  'SystemExit,TabError,TimeoutError,TypeError,UnboundLocalError,' +
  'UnicodeDecodeError,UnicodeEncodeError,UnicodeError,' +
  'UnicodeTranslateError,UnicodeWarning,UserWarning,ValueError,Warning,' +
  'ZeroDivisionError,_,__build_class__,__debug__,__doc__,__import__,' +
  '__loader__,__name__,__package__,__spec__,abs,all,any,apply,ascii,' +
  'basestring,bin,bool,buffer,bytearray,bytes,callable,chr,classmethod,cmp,' +
  'coerce,compile,complex,copyright,credits,delattr,dict,dir,divmod,' +
  'enumerate,eval,exec,execfile,exit,file,filter,float,format,frozenset,' +
  'getattr,globals,hasattr,hash,help,hex,id,input,int,intern,isinstance,' +
  'issubclass,iter,len,license,list,locals,long,map,max,memoryview,min,' +
  'next,object,oct,open,ord,pow,print,property,quit,range,raw_input,reduce,' +
  'reload,repr,reversed,round,set,setattr,slice,sorted,staticmethod,str,' +
  'sum,super,tuple,type,unichr,unicode,vars,xrange,zip');

  Python.ORDER_ATOMIC = 0;             // 0 "" ...
Python.ORDER_COLLECTION = 1;         // tuples, lists, dictionaries
Python.ORDER_STRING_CONVERSION = 1;  // `expression...`
Python.ORDER_MEMBER = 2.1;           // . []
Python.ORDER_FUNCTION_CALL = 2.2;    // ()
Python.ORDER_EXPONENTIATION = 3;     // **
Python.ORDER_UNARY_SIGN = 4;         // + -
Python.ORDER_BITWISE_NOT = 4;        // ~
Python.ORDER_MULTIPLICATIVE = 5;     // * / // %
Python.ORDER_ADDITIVE = 6;           // + -
Python.ORDER_BITWISE_SHIFT = 7;      // << >>
Python.ORDER_BITWISE_AND = 8;        // &
Python.ORDER_BITWISE_XOR = 9;        // ^
Python.ORDER_BITWISE_OR = 10;        // |
Python.ORDER_RELATIONAL = 11;        // in, not in, is, is not,
                                     //     <, <=, >, >=, <>, !=, ==
Python.ORDER_LOGICAL_NOT = 12;       // not
Python.ORDER_LOGICAL_AND = 13;       // and
Python.ORDER_LOGICAL_OR = 14;        // or
Python.ORDER_CONDITIONAL = 15;       // if else
Python.ORDER_LAMBDA = 16;            // lambda
Python.ORDER_NONE = 99;  

/**
 * Whether the init method has been called.
 * @type {?boolean}
 */
Python.isInitialized = false;

/**
 * Initialise the database of variable names.
 * @param {!Workspace} workspace Workspace to generate code from.
 * @this {CodeGenerator}
 */
Python.init = function(workspace) {
  // Call Blockly.CodeGenerator's init.
  Object.getPrototypeOf(this).init.call(this);

  /**
   * Empty loops or conditionals are not allowed in Python.
   */
  this.PASS = this.INDENT + 'pass\n';

  if (!this.nameDB_) {
    this.nameDB_ = new Blockly.Names(Python.RESERVED_WORDS_);
  } else {
    this.nameDB_.reset();
  }

  this.nameDB_.setVariableMap(workspace.getVariableMap());
  this.nameDB_.populateVariables(workspace);
  this.nameDB_.populateProcedures(workspace);

  const defvars = [];
  // Add developer variables (not created or named by the user).
  const devVarList = Variables.allDeveloperVariables(workspace);
  for (let i = 0; i < devVarList.length; i++) {
    defvars.push(
        this.nameDB_.getName(devVarList[i], Names.DEVELOPER_VARIABLE_TYPE) +
        ' = None');
  }

  // Add user variables, but only ones that are being used.
  const variables = Variables.allUsedVarModels(workspace);
  for (let i = 0; i < variables.length; i++) {
    defvars.push(
        this.nameDB_.getName(variables[i].getId(), NameType.VARIABLE) +
        ' = None');
  }

  this.definitions_['variables'] = defvars.join('\n');
  this.isInitialized = true;
};

// pythonGenerator.scrub_ = function(block, code, thisOnly) {
//     const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
//     if (nextBlock && !thisOnly) {
//         return code + ',\n' + pythonGenerator.blockToCode(nextBlock);
//     }
// }

Python['logic_null'] = function(block) {
    return ['null', Python.PRECEDENCE];
  }

Python['text'] = function(block) {
    const textValue = block.getFieldValue('TEXT');
    const code = `"${textValue}"`;
    return [code, Python.PRECEDENCE];
  }

Python['math_number'] = function(block) {
    const code = String(block.getFieldValue('NUM'));
    return [code, Python.PRECEDENCE];
  }

Python['logic_boolean'] = function(block) {
    const code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
    return [code, Python.PRECEDENCE];
  }

Python['member'] = function(block) {
    const name = block.getFieldValue('MEMBER_NAME');
    const value = Python.valueToCode(block, 'MEMBER_VALUE', Python.PRECEDENCE);
    const code = `"${name}": ${value}`;
    return code;
}

Python['lists_create_with'] = function(block) {
    const values = [];
    for (let i = 0; i < block.itemCount_; i++) {
      const valueCode = Python.valueToCode(block, 'ADD' + i,
          Python.PRECEDENCE);
      if (valueCode) {
        values.push(valueCode);
      }
    }
    const valueString = values.join(',\n');
    const indentedValueString =
        valueString.replace(/\n/g, '\n    ');
    const code = `{\n    ${indentedValueString}\n}`;
    return [code, Python.PRECEDENCE];
  }

Python['lists_create_with_item'] = function(block) {
    const value = Python.valueToCode(block, 'ITEM', Python.PRECEDENCE);
    return value;
  }

Python['lists_create_with_container'] = function(block) {
    const value = Python.statementToCode(block, 'STACK');
    return value;
  }

Python['object'] = function(block) {
    const statementMembers = Python.statementToCode(block, 'MEMBERS');
    const code = `{\n${statementMembers}}`;
    return [code, Python.PRECEDENCE];
  }

  
Python['controls_if'] = function(block) {
    // If/elseif/else condition.
  let n = 0;
  let code = '', branchCode, conditionCode;
  if (Python.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Python.injectId(Python.STATEMENT_PREFIX, block);
  }
  do {
    conditionCode =
        Python.valueToCode(block, 'IF' + n, Python.PRECEDENCE) || 'False';
    branchCode = Python.statementToCode(block, 'DO' + n) || Python.PASS;
    if (Python.STATEMENT_SUFFIX) {
      branchCode =
          Python.prefixLines(
              Python.injectId(Python.STATEMENT_SUFFIX, block), Python.INDENT) +
          branchCode;
    }
    code += (n === 0 ? 'if ' : 'elif ') + conditionCode + ':\n' + branchCode;
    n++;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Python.STATEMENT_SUFFIX) {
    branchCode = Python.statementToCode(block, 'ELSE') || Python.PASS;
    if (Python.STATEMENT_SUFFIX) {
      branchCode =
          Python.prefixLines(
              Python.injectId(Python.STATEMENT_SUFFIX, block), Python.INDENT) +
          branchCode;
    }
    code += 'else:\n' + branchCode;
  }
  return code; 
}

Python['controls_ifelse'] = Python['controls_if'];

Python['logic_compare'] = function(block) {
    // Comparison operator.
    const OPERATORS =
        {'EQ': '==', 'NEQ': '!=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>='};
    const operator = OPERATORS[block.getFieldValue('OP')];
    const order = Python.ORDER_RELATIONAL;
    const argument0 = Python.valueToCode(block, 'A', order) || '0';
    const argument1 = Python.valueToCode(block, 'B', order) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
  };
  
  Python['logic_operation'] = function(block) {
    // Operations 'and', 'or'.
    const operator = (block.getFieldValue('OP') === 'AND') ? 'and' : 'or';
    const order =
        (operator === 'and') ? Python.PRECEDENCE : Python.PRECEDENCE + 1;
    let argument0 = Python.valueToCode(block, 'A', order);
    let argument1 = Python.valueToCode(block, 'B', order);
    if (!argument0 && !argument1) {
      // If there are no arguments, then the return value is false.
      argument0 = 'False';
      argument1 = 'False';
    } else {
      // Single missing arguments have no effect on the return value.
      const defaultArgument = (operator === 'and') ? 'True' : 'False';
      if (!argument0) {
        argument0 = defaultArgument;
      }
      if (!argument1) {
        argument1 = defaultArgument;
      }
    }
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
  };
  
  Python['logic_negate'] = function(block) {
    // Negation.
    const argument0 =
        Python.valueToCode(block, 'BOOL', Python.ORDER_LOGICAL_NOT) || 'True';
    const code = 'not ' + argument0;
    return [code, Python.ORDER_LOGICAL_NOT];
  };
  
  Python['logic_boolean'] = function(block) {
    // Boolean values true and false.
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'True' : 'False';
    return [code, Python.ORDER_ATOMIC];
  };
  
  
  Python['logic_ternary'] = function(block) {
    // Ternary operator.
    const value_if =
        Python.valueToCode(block, 'IF', Python.ORDER_CONDITIONAL) || 'False';
    const value_then =
        Python.valueToCode(block, 'THEN', Python.ORDER_CONDITIONAL) || 'None';
    const value_else =
        Python.valueToCode(block, 'ELSE', Python.ORDER_CONDITIONAL) || 'None';
    const code = value_then + ' if ' + value_if + ' else ' + value_else;
    return [code, Python.ORDER_CONDITIONAL];
  };

  Python['variables_get'] = function(block) {
    // Variable getter.
    const code = Python.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
    return [code, Python.PRECEDENCE];
    };

   Python['variables_set'] = function(block) {
    // Variable setter.
    const argument0 = Python.valueToCode(block, 'VALUE', Python.PRECEDENCE) || 'None';
    const varName = Python.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
    return varName + ' = ' + argument0 + '\n';
    }; 

    Python['text_print'] = function(block) {
        
    const argument0 = Python.valueToCode(block, 'TEXT', Python.PRECEDENCE) || 'None';
    const code = 'print(' + argument0 + ')\n';
    return code;
      };
  // if cImpactVAl == "1" or (cImpactVAl == "2" and esRouter(eventDevice) <- boolean):