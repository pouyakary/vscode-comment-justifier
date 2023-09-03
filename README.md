# Comment Justifier

This is the most basic version of a comment justifier, it is so basic and unsafe that you probably should not use, until I can make the time to build the system fully. It lets you justify comments to be less than 40 characters. I didn't include any option to change the size because I think it should enforce that length, the length makes sure that it is the easiest thing to read.

> **🧨 Very Important Remark** <br>
> The current implementation doesn't have a markdown parser and
> therefore is not safe for justifying structured markdown comments.
> It will mess up the code blocks and other formatting that you might
> have. Only use it on plain and simple comments like the Go's
> simple comment system.

To justify a comment, move your cursor over it and apply the command. It's called `Justify Commend` and the command is `control`+`option`+`command`+`h`. The (`h` in Dvorak layout is j and funny enough, the h and j on the keyboard sit very near each other, so the command is perfect for both QWERTY and Dvorak users)