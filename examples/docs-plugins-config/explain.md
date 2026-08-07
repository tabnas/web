The finished language: `width: 2+3*4` yields 14, not the string `"2+3*4"`. No
parser was written — an existing one was picked, a plugin added the missing
part, and ten lines of evaluation did the rest.

No grammar file, no generated code, and no fork of jsonic: the base instance is
untouched, so other code using it is unaffected.
