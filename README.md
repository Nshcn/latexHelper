# latexHelper

latexHelper 是一个可以简化一些特定 latex 代码语法的工具，通过一些简单的语法代码生成其对应的 latex 语法，让作者更专注于写作本身。

![image](https://github.com/Nshcn/latexHelper/blob/main/img/latexHelper.gif)

## 使用方法

latexHelper 默认通过在行首的`#`作为标记符号，在两个行首的`#`之间书写文字内容。
latexHelper 分为两个大的编辑区，上方为 latexHelper 语法的编辑区，点击`生成 latex`按钮后即可在下方的编辑区显示对应的 latex 语法格式的内容。

第一个`#`后面紧跟着写上对应的代码块标记，例如`#ul`表示无序列表，`#fig`表示图片，目前支持以下标记。

#### 无序列表

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

#### 有序列表

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

#### 图片

取`#fig`或`#wfig`代码块中的内容作为图片的名字。

```
#fig
图片名字
#

#wfig
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

\begin{wrapfigure}[ht]
	\centering
	\includegraphics[width=0.8\textwidth]{图片名字.png}
	\caption{图片名字}
	\label{fig:图片名字}
	%\ref{fig:图片名字}
\end{wrapfigure}
```

#### 楷体

多行

```
#kaishu
楷体1
楷体2
楷体3
#
```

```latex
{\kaishu
楷体1
楷体2
楷体3
}
```

单行

```
=楷体=
```

```
{\kaishu 楷体}
```

#### 选择题选项

```
#opt
A. aaa
B。bbb
C, ccc
D ddd
eee
- 111
- 222
- 333
#
```

latexHelper 会自动去除掉选项前的 A,B,C,D,-等前缀

```latex
\onech
{aaa}
{bbb}
{ccc}
{ddd}
{eee}
{111}
{222}
{333}
```

latexHelper 会根据最长选项的长度来设置合适的选项行数。

#### 行内文字处理

两个`*`包裹的部分识别成加粗格式，两个`=`包裹的部分识别为楷体

```
#ul
中国人牛逼*中国人*牛逼中国人牛逼中国人牛逼
=中国人=万岁中国人万岁中国人万岁中国人万岁
#
```

```latex
\begin{itemize}[leftmargin=2\parindent]
	\item 中国人牛逼{\bf 中国人}牛逼中国人牛逼中国人牛逼
	\item {\kaishu 中国人}万岁中国人万岁中国人万岁中国人万岁
\end{itemize}
```

### 保存模板

在编辑区输入简版的 latexHelper 代码语法并输入模板名称后，可以点击`保存当前编辑区为新模板`来保存当前编辑区为模板。

### 代码片段

在下方的编辑区，可以保存一些自己常用的 latex 代码片段。

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

可以在

## 开发计划

- 支持多重嵌套列表
- 支持自定义标记符
- 支持更多 latex 语法
