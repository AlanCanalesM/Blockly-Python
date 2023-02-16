/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

export const toolbox = {
  'kind': 'flyoutToolbox',
  'contents': [
    {
      'kind': 'block',
      'type': 'object'
    },
    {
      'kind': 'block',
      'type': 'member'
    },
    {
      'kind': 'block',
      'type': 'math_number'
    },
    {
      'kind': 'block',
      'type': 'text'
    },
    {
      'kind': 'block',
      'type': 'logic_boolean'
    },
    {
      'kind': 'block',
      'type': 'logic_null'
    },
    {
      'kind': 'block',
      'type': 'lists_create_with'
    },
    {
      'kind': 'block',
      'type': 'controls_if'
    },
    {

      'kind': 'block',
      'type': 'controls_ifelse'
    },
    {
      'kind': 'block',
      'type': 'logic_compare'
    },
    {
      'kind': 'block',
      'type': 'logic_operation'
    },
    {
      'kind': 'block',
      'type': 'logic_negate'
    },
    {
      'kind': 'block',
      'type': 'logic_boolean'
    },
    {
      'kind': 'block',
      'type': 'logic_ternary'
    },
    {
      'kind': 'block',
      'type': 'variables_get'
    },
    {
      'kind': 'block',
      'type': 'variables_set'
    },
    {
      'kind': 'block',
      'type': 'text_print'
    }
  ]
}