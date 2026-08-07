Six lines buy a Pratt parser. Values are now expression trees and precedence is
already handled — `1+2*3` groups the multiplication first without you saying so.

The tree is a LISP-style S-expression: operator first, then its terms. Shown
abbreviated here, since the real first element is an operator node whose
readable part is its `src`.
