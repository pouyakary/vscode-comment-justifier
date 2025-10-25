# Comment Justifier

<img width="600" src="https://github.com/pouyakary/vscode-comment-justifier/assets/2157285/92d71a5e-b281-4ffb-94e9-fe63940dfdd8">

This is the most basic version of a comment justifier, it is so basic and unsafe that you probably should not use, until I can make the time to build the system fully. It lets you justify comments to be less than 40 characters. I didn't include any option to change the size because I think it should enforce that length, the length makes sure that it is the easiest thing to read.

> **🧨 Very Important Remark** <br>
> The current implementation doesn't have a markdown parser and
> therefore is not safe for justifying structured markdown comments.
> It will mess up the code blocks and other formatting that you might
> have. Only use it on plain and simple comments like the Go's
> simple comment system.

> **🧨 Very Important Remark** <br>
> This extension is only to test and develop the system. Once the
> system is complete and I'm satisfied with it. (When it has been
> battle tested for a while, and probably supports Markdown
> Structures), It will be moved inside the
> [Comment 6 Extension](https://marketplace.visualstudio.com/items?itemName=karyfoundation.comment)
> And removed from here.

To justify a comment, move your cursor over it and apply the command. It's called `Justify Commend` and the command is `control`+`option`+`command`+`h`. The (`h` in Dvorak layout is j and funny enough, the h and j on the keyboard sit very near each other, so the command is perfect for both QWERTY and Dvorak users)
