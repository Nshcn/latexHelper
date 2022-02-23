# latexHelper

latexHelper 是一个 latex 代码转换工具，通过简单的标记符号可以生成一些对应的 latex 代码。

## 使用方法

latexHelper 可以处理简化一些特定代码块的语法，更专注于写作本身。

latexHelper 默认通过`#`作为标记符号，两个`#`之间书写文字内容。

第一个`#`后面紧跟着写上对应的代码块标记，例如`ul`表示无序列表，目前支持的标记如下：

- `ul`：无序列表

```
#ul
aaa
bbb
#
```

```latex
\begin{itemize}[leftmargin=2\parindent]
	\item aaa
	\item bbb
\end{itemize}
```

- `ol`有序列表

```
#ol
aaa
bbb
#
```

```latex
\begin{enumerate}[leftmargin=2\parindent]
	\item aaa
	\item bbb
\end{enumerate}
```

- `fig`：图片

```
#fig
图片名字
#
```

```latex
\begin{figure}[ht]
	\centering
	\includegraphics[width=0.8\textwidth]{图片名字.png}
	\caption{图片名字}
	\label{fig:图片名字}
	%\ref{fig:图片名字}
\end{figure}
```

- `kaishu`：楷体文字片段

```
#kaishu
楷体书写的文字
#
```

```latex
{\kaishu
楷体书写的文字
}
```

- `opt`：选项

```
#opt
A. aaa
B。bbb
C, ccc
D ddd
eee
#
```

latexHelper 会自动去除掉选项前的 A,B,C,D 前缀

```
\onech
{aaa}
{bbb}
{ccc}
{ddd}
{eee}
```

## 注意

列表代码块暂不支持嵌套，即如下代码块不会生效

```
#ul
aaa
  #ul
  111
  222
  #
bbb
ccc
#
```
