# LatexHelper

LatexHelper 是一个可以简化一些特定 latex 代码语法的工具，通过一些简单的语法代码生成其对应的 latex 语法，让作者更专注于写作本身。

![image](https://github.com/Nshcn/latexHelper/blob/main/img/latexHelper.gif)

## 使用方法

LatexHelper 默认通过在行首的`#`作为标记符号，在两个行首的`#`之间书写文字内容。
LatexHelper 分为两个大的编辑区，上方为 LatexHelper 特有语法的编辑区（后面简称 LH 编辑区），点击`生成latex`按钮后即可在右侧 latex 原生语法编辑区显示对应的 latex 内容。

LH 编辑区的语法非常简单，在第一个`#`后面紧跟着写上特有的语法标记，例如`#ul`表示无序列表、`#fig`表示图片、`#bf`表示加粗等等。LatexHelper 目前支持以下语法。

#### 无序列表

```
#ul
aaa
bbb
#
```

===>

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

===>

```latex
\begin{enumerate}[leftmargin=2\parindent]
	\item aaa
	\item bbb
\end{enumerate}
```

列表代码块支持嵌套。

```
#ul
aaa
  #ol
  111
  222
  #
bbb
ccc
#
```

===>

```latex
\begin{itemize}[leftmargin=2\parindent]
\item aaa
  \begin{enumerate}[leftmargin=2\parindent]
  \item 111
  \item 222
  \begin{itemize}[leftmargin=2\parindent]
\item bbb
\item ccc
\end{itemize}
```

#### 图片

通过`#fig`或`#wfig`进行标记。

```
#fig
图片1
#

#wfig
图片2
#
```

===>

```latex
\begin{figure}[ht]
	\centering
	\includegraphics[width=0.8\textwidth]{图片路径.png}
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

支持并排显示多个图片

```
#fig
pic1
pic2
#
```

LatexHelper 会根据图片的数量设置合适的 width，最多可以支持并排显示 4 张图片。

===>

```latex
\begin{figure}[ht]
	\centering
	\subfigure[pic1]{
		\begin{minipage}[ht]{0.45\linewidth}
		\centering
		\includegraphics[width=2.5in]{图片路径.png}
		\label{fig:pic1}%\ref{fig:pic1}
		\end{minipage}
	}
	\subfigure[pic2]{
		\begin{minipage}[ht]{0.45\linewidth}
		\centering
		\includegraphics[width=2.5in]{图片路径.png}
		\label{fig:pic1}%\ref{fig:pic1}
		\end{minipage}
	}
	\caption{图片名}
	\label{fig:图片标签}%\ref{fig:图片标签}
\end{figure}
```

通过`[图片名](路径名)`的语法可以为图片指定名字和路径。

```
#fig
pic1
pic2
[name](path)
#
```

===>

```latex

\begin{figure}[ht]
	\centering
	\subfigure[pic1]{
		\begin{minipage}[ht]{0.45\linewidth}
		\centering
		\includegraphics[width=2.5in]{path.png}
		\label{fig:pic1}%\ref{fig:pic1}
		\end{minipage}
	}
	\subfigure[pic2]{
		\begin{minipage}[ht]{0.45\linewidth}
		\centering
		\includegraphics[width=2.5in]{path.png}
		\label{fig:pic1}%\ref{fig:pic1}
		\end{minipage}
	}
	\caption{name}
	\label{fig:name}%\ref{fig:name}
\end{figure}
```

LatexHelper 支持 markdown 的图片格式`![]()`，且兼容中文输入，例如`【name】（path）`也可以被正确识别。

```
![name](path)
```

将得到

```latex
\begin{figure}[ht]
	\centering
	\includegraphics[width=0.8\textwidth]{path.png}
	\caption{name}
	\label{fig:name}
	%\ref{fig:name}
\end{figure}
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

LatexHelper 会自动去除掉选项前多余的 A,B,C,D,-等前缀，并根据选项的长度来设置合适的选项行数。

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

在 LH 的编辑区输入 LatexHelper 代码语法后并填写模板名称，可以点击`保存当前编辑区为新模板`来保存当前编辑区为模板。同时可以删除已经存在的模板或对其进行修改覆盖。

### latex 原生语法编辑区

选中 latex 原生语法编辑区的内容后再点击转换按钮可以对其进行 latex 语法转换，如转换成有序列表、设置成楷体、加粗等。

```
aaa
bbb
```

选中上面的代码后点击`有序列表`会生成如下 latex 代码

```latex
\begin{enumerate}[leftmargin=2\parindent]
	\item aaa
	\item bbb
\end{enumerate}
```

#### 代码片段

可以保存一些自己常用的 latex 代码片段。

## 开发计划

- [x] 支持多重嵌套列表
- 支持自定义标记符
- 支持更多 latex 语法
