module.exports = function parseMarkdown(markdownText) {
	const htmlText = markdownText
    .replace(/==(.+?)==/gim, '<del class="doublestrike">$1</del>')
    .replace(/\^(.+?)\^/gim, '<span class="lineover">$1</span>')
    .replace(/__(.+?)__/gim, '<span class="underline">$1</span>')

    // font sizes
    .replace(/####(.+?)####/gim, '<span class="smallfont">$1</span>')
    .replace(/###(.+?)###/gim, '<span class="normalfont">$1</span>')
    .replace(/##(.+?)##/gim, '<span class="bigfont">$1</span>')
    .replace(/#(.+?)#/gim, '<span class="hugefont">$1</span>')

    .replace(/--(.+?)--/gim, '<span class="linethrough">$1</span>')

    .replace(/\+(.+?)\+/gim, '<sup>$1</sup>')
    .replace(/-(.+?)-/gim, '<sub>$1</sub>')

		.replace(/\*\*(.+?)\*\*/gim, '<span class="strong">$1</span>')
		.replace(/[\*_](.+?)[\*_]/gim, '<span class="italic">$1</span>')
    .replace(/~~(.+?)~~/gim, '<span class="linethrough">$1</span>')
    .replace(/\|\|(.+?)\|\|/gim, "<span onclick='replaceClass(this)' class='spoilerText hidden'>$1</span>")
    .replace(/\[(.+?)\]\((.+?)\)/gim, "<a href='$2'>$1</a>")

	return htmlText;
}