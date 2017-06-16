
var docxConverter = {
	toHtml: function(file) {
		this.reset();
		var zip = new JSZip();

		zip = zip.load(file, {base64: true});

		var content = this.getContent(zip, 'word/document.xml');
		this.getLinks(zip);
		// then convert xml to html
		var html = this.convertToHtml(content);

		return html;
	},

	getLinks: function(zip) {
		var rels = this.getContent(zip, 'word/_rels/document.xml.rels');
		var relXml = this.toXML(rels);

		for (var i = 0; i < relXml.childNodes.length; i++) {
			var relationship = relXml.childNodes[i];
			if (relationship.getAttribute('TargetMode') == "External") {
				//there's a hyperlink
				var target = relationship.getAttribute('Target');
				var rid = relationship.getAttribute('Id');
				this.links.push( this.createLink(target, rid) );
			}
		}
	},

	convertToHtml: function(xmlString) {
		var inputDoc = this.toXML( xmlString ).getElementsByTagName('body')[0]; 
		var output = this.newHTMLnode('DIV');
		var inNode;
		var outNode;
		for (i = 0; inNode = inputDoc.childNodes[i]; i++) {
			outNode = null;
			

			if (inNode.nodeName == "p") {

				var contents = inNode.textContent;

				//var letters = contents.match(/[\S]+/);

				// if (!contents || !letters) {
				if (!contents) {
					//empty spacing paragraph
					continue;
				}
			}

			var j = inNode.childNodes.length;
			var firstChild = inNode.childNodes[0];
			
			if (firstChild) {
				if ( firstChild.nodeName == 'pPr' ) {
					var pStyle = firstChild.getElementsByTagName('pStyle')[0];
					
					if (pStyle) {

						var style = pStyle.getAttribute('w:val');
						if (style == "Heading1") {
							outNode = output.appendChild(this.newHTMLnode('H1'));
						} else if (style == "Heading2") {
							outNode = output.appendChild(this.newHTMLnode('H2'));
						} else if (style == "Heading3") {
							outNode = output.appendChild(this.newHTMLnode('H3'));
						} else if (style == "ListBullet") {
							var ulNode = output.appendChild(this.newHTMLnode('UL'));
							outNode = ulNode.appendChild(this.newHTMLnode('LI'));
						} else if (style == "ListBullet2") {
							outNode = this.addNodesForLi(output, 'UL', 1);
						} else if (style == "ListNumber") {
							var olNode = output.appendChild(this.newHTMLnode('OL'));
							outNode = olNode.appendChild(this.newHTMLnode('LI'));
						} else if (style == 'ListNumber2') {
							outNode = this.addNodesForLi(output, 'OL', 1);
						} else if (style == "ListParagraph") {

							var numPr = firstChild.getElementsByTagName('numPr')[0];
							if (numPr) {
								var ilvl = numPr.getElementsByTagName('ilvl')[0];
								var numId = numPr.getElementsByTagName('numId')[0];

								var ilvl = parseInt(ilvl.getAttribute('w:val'));
								var numId = numId.getAttribute('w:val');	

								if (numId && (numId == "1" || numId == "2")) {

									var listType = 'UL';
									switch (numId) {
										case "1":
											listType = 'UL';
											break;
										case "2":
											listType = 'OL';
											break;
									}

									outNode = this.addNodesForLi(output, listType, ilvl);
									
								} else {
									outNode = output.appendChild(this.newHTMLnode('P'));
								}
							} else {
								outNode = output.appendChild(this.newHTMLnode('P'));
							}
						}
						else {
							outNode = output.appendChild(this.newHTMLnode('P'));	
						}	
					} else {

						outNode = output.appendChild(this.newHTMLnode('P'));	
					}
					
				} else {
					outNode = output.appendChild(this.newHTMLnode('P'));
				}
			}
			
			
			var tempStr = '';
			var inNodeChild, styleAttrNode;
			for (j = 0; inNodeChild = inNode.childNodes[j]; j++) {

				if (inNodeChild.nodeName == 'del') {
					continue;
				}
				// if (inNodeChild.nodeName === 'pPr') {
				// 	if (styleAttrNode = inNodeChild.getElementsByTagName('jc')[0]) { outNode.style.textAlign = styleAttrNode.getAttribute('w:val'); }
				// }
				
				if (inNodeChild.nodeName === 'hyperlink') {
					var rid = inNodeChild.getAttribute('r:id');
					var link = this.getLinkFromRid(rid);
					if (link) {
						var val = inNodeChild.textContent;
						val = '<a href="' + link + '" target="_blank">' + val + '</a>';
						tempStr += val;
					}
					//wrap in a tag if not false
				}

				if (inNodeChild.nodeName == 'ins') {
					tempStr += inNodeChild.textContent;
				}

				var fauxHeading = false;
				var fauxType = 'h1';
				if (inNodeChild.nodeName === 'r') {
					var val = inNodeChild.textContent;

					if (inNodeChild.getElementsByTagName('b').length) { val = '<strong>' + val + '</strong>'; }
					if (inNodeChild.getElementsByTagName('i').length) { val = '<em>' + val + '</em>'; }
					
					if (styleAttrNode = inNodeChild.getElementsByTagName('sz')[0]) { 
						var fontSize = styleAttrNode.getAttribute('w:val') / 2;
						if (fontSize > 12) {
							fauxHeading = true;
							if (fontSize >= 16) {
								fauxType = 'h1';
							} else if (fontSize >= 14) {
								fauxType = 'h2';
							} else {
								fauxType = 'h3';
							}
						}
					}
					
					tempStr += val;
				}
				if (fauxHeading) {
					//clean up so we don't get an h1/h2/h3 inside a p tag
					if (output.childNodes.length) { //if it's not the first elements
						var lastNode = output.lastChild;
						output.removeChild(output.lastChild);
							
					} 

					var heading = output.appendChild(this.newHTMLnode(fauxType));
					heading.innerHTML = tempStr;
					
				} else {
					
					if(outNode) {
						outNode.innerHTML = tempStr;
					}
					
				}
				
			}

		}

		var nodes = output.childNodes; //NodeList object, need to convert to string
		output = "";
		for (var i = 0; i < nodes.length; ++i) {
		  var htmlString = nodes[i].outerHTML;
		  output += htmlString;  
		}
		return output;
	},

	addNodesForLi: function(output, listType, indentLevel) {
		var lastNode = output.childNodes[ output.childNodes.length - 1 ];
		var outNode;

		if (lastNode && lastNode.nodeName == listType) {
			if (indentLevel > 0) {
				var lastLi = lastNode.childNodes[ lastNode.childNodes.length - 1 ];
				var ulCheck = this.checkLiForUl(lastLi, listType);

				if (ulCheck.present) {
					outNode = ulCheck.list.appendChild(this.newHTMLnode('LI'));
				} else {
					var ulNode = lastLi.appendChild(this.newHTMLnode(listType));
					outNode = ulNode.appendChild(this.newHTMLnode('LI'));
				}
				
			} else { //not indented

				//add li to previous ul
				outNode = lastNode.appendChild(this.newHTMLnode('LI'));
			}
			
		} else {
			var ulNode = output.appendChild(this.newHTMLnode(listType));
			outNode = ulNode.appendChild(this.newHTMLnode('LI'));
		}
		return outNode;

	},

	checkLiForUl: function(li, type) {
		var listPresent = false; 
		var list;
		for (var i = 0; i < li.childNodes.length; i++) {
			var liSubNode = li.childNodes[i];
			if (liSubNode.nodeName == type) {
				listPresent = true;
				list = liSubNode;
			}
		}

		if (listPresent) {
			return {present: true, list: list};
		} else {
			return {present: false};
		}
	},

	getLinkFromRid: function(rid) {
		if (this.links && this.links.length) {
			for (var i = 0; i < this.links.length; i++) {
				var link = this.links[i];
				if (link.id == rid) {
					return link.target;
				}
			}
			return false; //just in case
		} else {
			return false;
		}
	},

	newHTMLnode: function(name, html) {
		var el = document.createElement(name);
		el.innerHTML = html || '';
		return el;
	},

	toXML: function(string) {
		var cleanedString = string.replace(/<[a-zA-Z]*?:/g, '<');
		cleanedString = cleanedString.replace(/<\/[a-zA-Z]*?:/g, '</');
		return new DOMParser().parseFromString(cleanedString, 'text/xml').firstChild; 
	},

	getContent: function(zip, file) {

		var data = zip.files[file]._data.getContent();
		var string = this.utf8ArrayToStr(data);

		return string;
	},

	utf8ArrayToStr: function(array) {
		var out, i, len, c;
		var char2, char3;

		out = "";
		len = array.length;
		i = 0;
		while(i < len) {
		c = array[i++];
		switch(c >> 4)
		{ 
		  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
		    // 0xxxxxxx
		    out += String.fromCharCode(c);
		    break;
		  case 12: case 13:
		    // 110x xxxx   10xx xxxx
		    char2 = array[i++];
		    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
		    break;
		  case 14:
		    // 1110 xxxx  10xx xxxx  10xx xxxx
		    char2 = array[i++];
		    char3 = array[i++];
		    out += String.fromCharCode(((c & 0x0F) << 12) |
		                   ((char2 & 0x3F) << 6) |
		                   ((char3 & 0x3F) << 0));
		    break;
		}
		}

		return out;
	},
	

	stats: {},
	links: [],

	createLink: function(url, id) {
		var link = {
			target: url,
			id: id,
		};
		return link;
	},

	reset: function() {
		this.stats = {};
		this.links = [];
	},

	toDocx: function(inputHtml) {
		this.reset();

		this.stats = this.getStats(inputHtml);
		var doc = new DOMParser().parseFromString('<root></root>', 'text/xml');
		doc.getElementsByTagName('root')[0].appendChild(this.newXMLnode(doc, 'body'));
		
		var output = doc.getElementsByTagName('w:body')[0];

		var nodeCount = inputHtml.childNodes.length;

		for (var i = 0; i < nodeCount; i++) {
			//loop through the nodes
			var innerNode = inputHtml.childNodes[i];

			var xmlNode = this.convertToWordML(doc, output, innerNode); //convert html node to WordML node
			// output.appendChild(xmlNode);
			
			
		}

		xmlString = new XMLSerializer().serializeToString(output).replace(/<w:t>/g, '<w:t xml:space="preserve">').replace(/<\/w:body>/g, '');

		var zip = this.zip(xmlString, stats);

		return zip;
	},

	convertToWordML: function(xmlDoc, output, htmlNode) {
		
		this.stats.paragraphs = 0;
		//check for list
		if ( this.isAList(htmlNode) ) {

			//TODO: deal with ULs inside LIs

			for (var i = 0; i < htmlNode.childNodes.length; i++) {

				var innerNode = htmlNode.childNodes[i]; //an LI node
				var checkList = this.checkForNestedList(innerNode);
				if (checkList.hasList) {
					//send the regular LI first
					this.addParagraphToOutput(xmlDoc, output, innerNode, true);
					//loop through UL
					for (var i = 0; i < checkList.list.childNodes.length; i++) {
						var innerLi = checkList.list.childNodes[i];
						this.addParagraphToOutput(xmlDoc, output, innerLi);
					};
				} else {
					this.addParagraphToOutput(xmlDoc, output, innerNode);	
				}

				
			};

		} else {

			this.addParagraphToOutput(xmlDoc, output, htmlNode);
		}
	},

	addParagraphToOutput: function(xmlDoc, output, node, isASpecialLi) {
		this.stats.paragraphs++;
		var xmlNode = this.paragraphToWordML(xmlDoc, node, isASpecialLi);
		output.appendChild(xmlNode);
	},

	checkForNestedList: function(htmlNode) {
		//checks to see if this LI has a UL/OL inside
		var hasNestedList = false;
		var list = "";

		for (var i = 0; i < htmlNode.childNodes.length; i++) {

			var innerNode = htmlNode.childNodes[i];
			if (innerNode.nodeName == "OL" || innerNode.nodeName == "UL") {
				hasNestedList = true;
				list = innerNode;
				break;
			}
			
		};
		return {hasList: hasNestedList, list: list};
	},

	paragraphToWordML: function(xmlDoc, htmlNode, isASpecialLi) {

		var xmlNode = this.newXMLnode(xmlDoc, 'p'); //make an xml node

		//for block, add any formatting elements
		var pPr = xmlNode.appendChild(this.newXMLnode(xmlDoc, 'pPr')); //put in a paragraph style element

		//if heading
		if ( this.isAHeading(htmlNode) ) {

			var pStyle = pPr.appendChild(this.newXMLnode(xmlDoc, 'pStyle'));

			var style = "";
			
			switch (htmlNode.nodeName) {
				case "H1":
					style = "Heading1";
					break;
				case "H2":
					style = "Heading2";
					break;
				case "H3":
					style = "Heading3";
					break;
			}

			pStyle.setAttribute('w:val', style);

			for (var i = 0; i < htmlNode.childNodes.length; i++) {
				var innerNode = htmlNode.childNodes[i];

				if( innerNode.nodeName === '#text' ) {
					this.addWordTextNode(xmlDoc, htmlNode, xmlNode);
				} 
			};

		} else { //if standard paragraph or li


			if ( htmlNode.nodeName == "LI" ) { //li. 
				// special li's are the text content from an li with nested ul

				var pStyle = pPr.appendChild(this.newXMLnode(xmlDoc, 'pStyle'));
				var parentElem = "UL";
				var grandparentElem = "DIV";

				parentElem = htmlNode.parentNode.nodeName;
				grandparentElem = htmlNode.parentNode.parentNode.nodeName;

				if (parentElem == "OL") { //number list
					if (grandparentElem == "LI") {
						pStyle.setAttribute('w:val', "ListNumber2");	
					} else {
						pStyle.setAttribute('w:val', "ListNumber");	
					}
					
				} else { //ul
					if (grandparentElem == "LI") {
						pStyle.setAttribute('w:val', "ListBullet2");	
					} else {
						pStyle.setAttribute('w:val', "ListBullet");	
					}
				}

				//then check parent parent for indention level

				

			} 

			if (htmlNode.nodeName == "#text") {
				var xmlNodeChild = xmlNode.appendChild(this.newXMLnode(xmlDoc, 'r'));
				xmlNodeChild.appendChild(this.newXMLnode(xmlDoc, 't', htmlNode.textContent));
				
			} else { //normal graph

				var spacing = pPr.appendChild(this.newXMLnode(xmlDoc, 'spacing'));
				spacing.setAttribute('w:before', '240');

				for (var i = 0; i < htmlNode.childNodes.length; i++) {

					var innerHtmlNode = htmlNode.childNodes[i];

					var xmlNodeChild = xmlNode.appendChild(this.newXMLnode(xmlDoc, 'r'));
					
					var xmlNodeChild;

					if (isASpecialLi && (innerHtmlNode.nodeName == "UL" || innerHtmlNode.nodeName == "OL")) {
						break;
					} 

					if ( innerHtmlNode != "#text" ) {
						//handle strong, em

						var tempStr = innerHtmlNode.outerHTML;

						if (tempStr && tempStr.indexOf('<b>') > -1) { 
							var styleAttrNode = xmlNodeChild.appendChild(this.newXMLnode(xmlDoc, 'rPr'));
							styleAttrNode.appendChild(this.newXMLnode(xmlDoc, 'b')); 
						}
						if (tempStr && tempStr.indexOf('<strong>') > -1) { 
							var styleAttrNode = xmlNodeChild.appendChild(this.newXMLnode(xmlDoc, 'rPr'));
							styleAttrNode.appendChild(this.newXMLnode(xmlDoc, 'b')); 
						}
						if (tempStr && tempStr.indexOf('<i>') > -1) { 
							var styleAttrNode = xmlNodeChild.appendChild(this.newXMLnode(xmlDoc, 'rPr'));
							styleAttrNode.appendChild(this.newXMLnode(xmlDoc, 'i')); 
						}
						if (tempStr && tempStr.indexOf('<em>') > -1) { 
							var styleAttrNode = xmlNodeChild.appendChild(this.newXMLnode(xmlDoc, 'rPr'));
							styleAttrNode.appendChild(this.newXMLnode(xmlDoc, 'i')); 
						}
						if (tempStr && tempStr.indexOf('<a href') > -1) {
							//get link and save to rels table
							var rid = "rId10";
							var regex =  /href=\"([\s\S]*?)\"/;
							var url = regex.exec(tempStr);
							url = url[1]; // match is first, match group is second
							if (this.links && this.links.length) {
								var index = this.links.length;
								var trueIndex = 10 + index;
								this.links.push( this.createLink(url, trueIndex) );
								rid = "rId" + trueIndex.toString();
							} else {
								//start
								this.links = [ this.createLink(url, 10) ];
							}

							//wrap normal r and t in hyperlink
							var xmlHyperlinkNode = xmlNode.appendChild(this.newXMLnode(xmlDoc, 'hyperlink'));
							xmlHyperlinkNode.setAttribute('r:id', rid);
							xmlHyperlinkNode.setAttribute('w:history', "1");

							xmlNodeChild = xmlHyperlinkNode.appendChild(this.newXMLnode(xmlDoc, 'r'));
							var styleAttrNode = xmlNodeChild.appendChild(this.newXMLnode(xmlDoc, 'rPr'));
							var rStyle = styleAttrNode.appendChild(this.newXMLnode(xmlDoc, 'rStyle')); 
							rStyle.setAttribute('w:val', 'Hyperlink');
						}
					} 

					if (xmlNodeChild) {
						xmlNodeChild.appendChild(this.newXMLnode(xmlDoc, 't', innerHtmlNode.textContent));						
					}
					
				};
			}

			
		}
		
		return xmlNode;

	},

	addWordTextNode: function(xmlDoc, htmlNode, xmlNode) {
		xmlNode.appendChild(this.newXMLnode(xmlDoc, 'r')).appendChild(this.newXMLnode(xmlDoc, 't', htmlNode.textContent)); 
	},

	isAHeading: function(node) {
		return node.nodeName == 'H1' || node.nodeName == 'H2' || node.nodeName == 'H3';
	},

	isAList: function(node) {
		return node.nodeName == 'UL' || node.nodeName == 'OL';
	},

	newXMLnode: function(xmlDoc, name, text) {
		var elem = xmlDoc.createElement('w:' + name);
		if (text) { elem.appendChild(xmlDoc.createTextNode(text)); }
		return elem;
	},

	zip: function(xmlString) {
		zip = new JSZip();
		var stats = this.stats;

		zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/customXml/itemProps1.xml" ContentType="application/vnd.openxmlformats-officedocument.customXmlProperties+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/stylesWithEffects.xml" ContentType="application/vnd.ms-word.stylesWithEffects+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/><Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/><Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');
		zip.folder('_rels').file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
		var docProps = zip.folder('docProps');
		
		var word = zip.folder('word');
		//TODO: add the rels for links
		var linkRels = this.getLinkRels();

		word.folder('_rels').file('document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects" Target="stylesWithEffects.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/><Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/><Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' + linkRels + '</Relationships>');
		word.folder('theme').file('theme1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ 明朝"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="100000"/><a:shade val="100000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="50000"/><a:shade val="100000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults><a:spDef><a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="1"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="3"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="2"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></a:style></a:spDef><a:lnDef><a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="2"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="0"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="1"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></a:style></a:lnDef></a:objectDefaults><a:extraClrSchemeLst/></a:theme>');
		
		word.file('fontTable.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:fonts xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14"><w:font w:name="Symbol"><w:panose1 w:val="00000000000000000000"/><w:charset w:val="02"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000000" w:usb1="10000000" w:usb2="00000000" w:usb3="00000000" w:csb0="80000000" w:csb1="00000000"/></w:font><w:font w:name="Times New Roman"><w:panose1 w:val="02020603050405020304"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Cambria"><w:panose1 w:val="02040503050406030204"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="ＭＳ 明朝"><w:panose1 w:val="00000000000000000000"/><w:charset w:val="80"/><w:family w:val="roman"/><w:notTrueType/><w:pitch w:val="fixed"/><w:sig w:usb0="00000001" w:usb1="08070000" w:usb2="00000010" w:usb3="00000000" w:csb0="00020000" w:csb1="00000000"/></w:font><w:font w:name="Georgia"><w:panose1 w:val="02040502050405020303"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="ＭＳ ゴシック"><w:panose1 w:val="00000000000000000000"/><w:charset w:val="80"/><w:family w:val="modern"/><w:notTrueType/><w:pitch w:val="fixed"/><w:sig w:usb0="00000001" w:usb1="08070000" w:usb2="00000010" w:usb3="00000000" w:csb0="00020000" w:csb1="00000000"/></w:font><w:font w:name="Arial"><w:panose1 w:val="020B0604020202020204"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font></w:fonts>');
		word.file('numbering.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mo="http://schemas.microsoft.com/office/mac/office/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14"><w:abstractNum w:abstractNumId="0"><w:nsid w:val="FFFFFF7C"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="4BCE7FE8"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="1800"/></w:tabs><w:ind w:left="1800" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="1"><w:nsid w:val="FFFFFF7D"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="BA9688CA"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="1440"/></w:tabs><w:ind w:left="1440" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="2"><w:nsid w:val="FFFFFF7E"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="644638BA"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="1080"/></w:tabs><w:ind w:left="1080" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="3"><w:nsid w:val="FFFFFF7F"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="532E9FB6"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="ListNumber2"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="720"/></w:tabs><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="4"><w:nsid w:val="FFFFFF80"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="5C0A4F7A"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val=""/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="1800"/></w:tabs><w:ind w:left="1800" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/></w:rPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="5"><w:nsid w:val="FFFFFF81"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="4CC0B648"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val=""/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="1440"/></w:tabs><w:ind w:left="1440" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/></w:rPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="6"><w:nsid w:val="FFFFFF82"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="E8EE77DA"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val=""/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="1080"/></w:tabs><w:ind w:left="1080" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/></w:rPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="7"><w:nsid w:val="FFFFFF83"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="3A567202"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:pStyle w:val="ListBullet2"/><w:lvlText w:val=""/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="720"/></w:tabs><w:ind w:left="720" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/></w:rPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="8"><w:nsid w:val="FFFFFF88"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="CE0658D6"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="ListNumber"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="360"/></w:tabs><w:ind w:left="360" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="9"><w:nsid w:val="FFFFFF89"/><w:multiLevelType w:val="singleLevel"/><w:tmpl w:val="81F06758"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:pStyle w:val="ListBullet"/><w:lvlText w:val=""/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="360"/></w:tabs><w:ind w:left="360" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="9"/></w:num><w:num w:numId="2"><w:abstractNumId w:val="7"/></w:num><w:num w:numId="3"><w:abstractNumId w:val="6"/></w:num><w:num w:numId="4"><w:abstractNumId w:val="5"/></w:num><w:num w:numId="5"><w:abstractNumId w:val="4"/></w:num><w:num w:numId="6"><w:abstractNumId w:val="8"/></w:num><w:num w:numId="7"><w:abstractNumId w:val="3"/></w:num><w:num w:numId="8"><w:abstractNumId w:val="2"/></w:num><w:num w:numId="9"><w:abstractNumId w:val="1"/></w:num><w:num w:numId="10"><w:abstractNumId w:val="0"/></w:num></w:numbering>');
		word.file('settings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" mc:Ignorable="w14"><w:zoom w:percent="100"/><w:proofState w:spelling="clean" w:grammar="clean"/><w:stylePaneFormatFilter w:val="1004" w:allStyles="0" w:customStyles="0" w:latentStyles="1" w:stylesInUse="0" w:headingStyles="0" w:numberingStyles="0" w:tableStyles="0" w:directFormattingOnRuns="0" w:directFormattingOnParagraphs="0" w:directFormattingOnNumbering="0" w:directFormattingOnTables="0" w:clearFormatting="1" w:top3HeadingStyles="0" w:visibleStyles="0" w:alternateStyleNames="0"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:savePreviewPicture/><w:compat><w:useFELayout/><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="14"/><w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="doNotFlipMirrorIndents" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/></w:compat><w:rsids><w:rsidRoot w:val="00335FD1"/><w:rsid w:val="0025570D"/><w:rsid w:val="00335FD1"/><w:rsid w:val="00AB3EB3"/></w:rsids><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr><w:themeFontLang w:val="en-US" w:eastAsia="ja-JP"/><w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/><w:doNotAutoCompressPictures/><w:shapeDefaults><o:shapedefaults v:ext="edit" spidmax="1026"/><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="1"/></o:shapelayout></w:shapeDefaults><w:decimalSymbol w:val="."/><w:listSeparator w:val=","/><w14:docId w14:val="4B2A12A0"/><w14:defaultImageDpi w14:val="300"/></w:settings>');
		word.file('styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorEastAsia" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault/></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="1" w:defUnhideWhenUsed="1" w:defQFormat="0" w:count="276"><w:lsdException w:name="Normal" w:semiHidden="0" w:uiPriority="0" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:semiHidden="0" w:uiPriority="9" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 2" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 3" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 4" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 5" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 6" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 7" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 8" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 9" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="toc 1" w:uiPriority="39"/><w:lsdException w:name="toc 2" w:uiPriority="39"/><w:lsdException w:name="toc 3" w:uiPriority="39"/><w:lsdException w:name="toc 4" w:uiPriority="39"/><w:lsdException w:name="toc 5" w:uiPriority="39"/><w:lsdException w:name="toc 6" w:uiPriority="39"/><w:lsdException w:name="toc 7" w:uiPriority="39"/><w:lsdException w:name="toc 8" w:uiPriority="39"/><w:lsdException w:name="toc 9" w:uiPriority="39"/><w:lsdException w:name="caption" w:uiPriority="35" w:qFormat="1"/><w:lsdException w:name="Title" w:semiHidden="0" w:uiPriority="10" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Default Paragraph Font" w:uiPriority="1"/><w:lsdException w:name="Subtitle" w:semiHidden="0" w:uiPriority="11" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Strong" w:semiHidden="0" w:uiPriority="22" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:semiHidden="0" w:uiPriority="20" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Table Grid" w:semiHidden="0" w:uiPriority="59" w:unhideWhenUsed="0"/><w:lsdException w:name="Placeholder Text" w:unhideWhenUsed="0"/><w:lsdException w:name="No Spacing" w:semiHidden="0" w:uiPriority="1" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 1" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 1" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 1" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Revision" w:unhideWhenUsed="0"/><w:lsdException w:name="List Paragraph" w:semiHidden="0" w:uiPriority="34" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Quote" w:semiHidden="0" w:uiPriority="29" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:semiHidden="0" w:uiPriority="30" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 1" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 1" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 1" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 1" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 2" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 2" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 2" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 2" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 2" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 2" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 2" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 2" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 3" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 3" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 3" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 3" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 3" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 3" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 3" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 3" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 3" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 4" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 4" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 4" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 4" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 4" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 4" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 4" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 4" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 4" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 5" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 5" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 5" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 5" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 5" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 5" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 5" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 5" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 5" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 6" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 6" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 6" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 6" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 6" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 6" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 6" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 6" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 6" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Subtle Emphasis" w:semiHidden="0" w:uiPriority="19" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:semiHidden="0" w:uiPriority="21" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:semiHidden="0" w:uiPriority="31" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:semiHidden="0" w:uiPriority="32" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Book Title" w:semiHidden="0" w:uiPriority="33" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:uiPriority="37"/><w:lsdException w:name="TOC Heading" w:uiPriority="39" w:qFormat="1"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:rsid w:val="00335FD1"/><w:pPr><w:spacing w:before="120" w:after="120" w:line="280" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading1Char"/><w:uiPriority w:val="9"/><w:qFormat/><w:rsid w:val="00335FD1"/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="240" w:after="240"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:rFonts w:eastAsiaTheme="majorEastAsia" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:color w:val="000000" w:themeColor="text1"/><w:sz w:val="36"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Heading1"/><w:next w:val="Normal"/><w:link w:val="Heading2Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="00335FD1"/><w:pPr><w:spacing w:before="120" w:after="120"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:bCs w:val="0"/><w:sz w:val="28"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Heading2"/><w:next w:val="Normal"/><w:link w:val="Heading3Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="00335FD1"/><w:pPr><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:bCs/><w:sz w:val="24"/></w:rPr></w:style><w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Heading1Char"><w:name w:val="Heading 1 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading1"/><w:uiPriority w:val="9"/><w:rsid w:val="00335FD1"/><w:rPr><w:rFonts w:ascii="Georgia" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Georgia" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:color w:val="000000" w:themeColor="text1"/><w:sz w:val="36"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Heading2Char"><w:name w:val="Heading 2 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading2"/><w:uiPriority w:val="9"/><w:rsid w:val="00335FD1"/><w:rPr><w:rFonts w:ascii="Georgia" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Georgia" w:cstheme="majorBidi"/><w:b/><w:color w:val="000000" w:themeColor="text1"/><w:sz w:val="28"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Heading3Char"><w:name w:val="Heading 3 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading3"/><w:uiPriority w:val="9"/><w:rsid w:val="00335FD1"/><w:rPr><w:rFonts w:ascii="Georgia" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Georgia" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:color w:val="000000" w:themeColor="text1"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:basedOn w:val="DefaultParagraphFont"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:rPr><w:color w:val="0000FF" w:themeColor="hyperlink"/><w:u w:val="single"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:pPr><w:numPr><w:numId w:val="1"/></w:numPr><w:contextualSpacing/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="ListBullet2"><w:name w:val="List Bullet 2"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:pPr><w:numPr><w:numId w:val="2"/></w:numPr><w:contextualSpacing/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="ListNumber"><w:name w:val="List Number"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:pPr><w:numPr><w:numId w:val="6"/></w:numPr><w:contextualSpacing/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="ListNumber2"><w:name w:val="List Number 2"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:pPr><w:numPr><w:numId w:val="7"/></w:numPr><w:contextualSpacing/></w:pPr></w:style></w:styles>');
		word.file('stylesWithEffects.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mo="http://schemas.microsoft.com/office/mac/office/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorEastAsia" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault/></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="1" w:defUnhideWhenUsed="1" w:defQFormat="0" w:count="276"><w:lsdException w:name="Normal" w:semiHidden="0" w:uiPriority="0" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:semiHidden="0" w:uiPriority="9" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 2" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 3" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 4" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 5" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 6" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 7" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 8" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 9" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="toc 1" w:uiPriority="39"/><w:lsdException w:name="toc 2" w:uiPriority="39"/><w:lsdException w:name="toc 3" w:uiPriority="39"/><w:lsdException w:name="toc 4" w:uiPriority="39"/><w:lsdException w:name="toc 5" w:uiPriority="39"/><w:lsdException w:name="toc 6" w:uiPriority="39"/><w:lsdException w:name="toc 7" w:uiPriority="39"/><w:lsdException w:name="toc 8" w:uiPriority="39"/><w:lsdException w:name="toc 9" w:uiPriority="39"/><w:lsdException w:name="caption" w:uiPriority="35" w:qFormat="1"/><w:lsdException w:name="Title" w:semiHidden="0" w:uiPriority="10" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Default Paragraph Font" w:uiPriority="1"/><w:lsdException w:name="Subtitle" w:semiHidden="0" w:uiPriority="11" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Strong" w:semiHidden="0" w:uiPriority="22" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:semiHidden="0" w:uiPriority="20" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Table Grid" w:semiHidden="0" w:uiPriority="59" w:unhideWhenUsed="0"/><w:lsdException w:name="Placeholder Text" w:unhideWhenUsed="0"/><w:lsdException w:name="No Spacing" w:semiHidden="0" w:uiPriority="1" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 1" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 1" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 1" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Revision" w:unhideWhenUsed="0"/><w:lsdException w:name="List Paragraph" w:semiHidden="0" w:uiPriority="34" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Quote" w:semiHidden="0" w:uiPriority="29" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:semiHidden="0" w:uiPriority="30" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 1" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 1" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 1" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 1" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 2" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 2" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 2" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 2" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 2" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 2" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 2" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 2" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 3" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 3" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 3" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 3" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 3" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 3" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 3" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 3" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 3" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 4" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 4" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 4" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 4" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 4" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 4" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 4" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 4" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 4" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 5" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 5" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 5" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 5" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 5" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 5" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 5" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 5" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 5" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 6" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 6" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 6" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 6" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 6" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 6" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 6" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 6" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 6" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Subtle Emphasis" w:semiHidden="0" w:uiPriority="19" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:semiHidden="0" w:uiPriority="21" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:semiHidden="0" w:uiPriority="31" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:semiHidden="0" w:uiPriority="32" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Book Title" w:semiHidden="0" w:uiPriority="33" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:uiPriority="37"/><w:lsdException w:name="TOC Heading" w:uiPriority="39" w:qFormat="1"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:rsid w:val="00335FD1"/><w:pPr><w:spacing w:before="120" w:after="120" w:line="360" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading1Char"/><w:uiPriority w:val="9"/><w:qFormat/><w:rsid w:val="00335FD1"/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="240" w:after="240"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:rFonts w:eastAsiaTheme="majorEastAsia" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:color w:val="000000" w:themeColor="text1"/><w:sz w:val="36"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Heading1"/><w:next w:val="Normal"/><w:link w:val="Heading2Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="00335FD1"/><w:pPr><w:spacing w:before="120" w:after="120"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:bCs w:val="0"/><w:sz w:val="28"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Heading2"/><w:next w:val="Normal"/><w:link w:val="Heading3Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="00335FD1"/><w:pPr><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:bCs/><w:sz w:val="24"/></w:rPr></w:style><w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Heading1Char"><w:name w:val="Heading 1 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading1"/><w:uiPriority w:val="9"/><w:rsid w:val="00335FD1"/><w:rPr><w:rFonts w:ascii="Georgia" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Georgia" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:color w:val="000000" w:themeColor="text1"/><w:sz w:val="36"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Heading2Char"><w:name w:val="Heading 2 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading2"/><w:uiPriority w:val="9"/><w:rsid w:val="00335FD1"/><w:rPr><w:rFonts w:ascii="Georgia" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Georgia" w:cstheme="majorBidi"/><w:b/><w:color w:val="000000" w:themeColor="text1"/><w:sz w:val="28"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Heading3Char"><w:name w:val="Heading 3 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading3"/><w:uiPriority w:val="9"/><w:rsid w:val="00335FD1"/><w:rPr><w:rFonts w:ascii="Georgia" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Georgia" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:color w:val="000000" w:themeColor="text1"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:basedOn w:val="DefaultParagraphFont"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:rPr><w:color w:val="0000FF" w:themeColor="hyperlink"/><w:u w:val="single"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:pPr><w:numPr><w:numId w:val="1"/></w:numPr><w:contextualSpacing/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="ListBullet2"><w:name w:val="List Bullet 2"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:pPr><w:numPr><w:numId w:val="2"/></w:numPr><w:contextualSpacing/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="ListNumber"><w:name w:val="List Number"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:pPr><w:numPr><w:numId w:val="6"/></w:numPr><w:contextualSpacing/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="ListNumber2"><w:name w:val="List Number 2"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="00335FD1"/><w:pPr><w:numPr><w:numId w:val="7"/></w:numPr><w:contextualSpacing/></w:pPr></w:style></w:styles>');
		word.file('webSettings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:webSettings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14"><w:allowPNG/><w:doNotSaveAsSingleFile/></w:webSettings>');

		var date = new Date().toISOString();
		var creator = 'Hemingway';
		docProps.file('core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>'
			+ creator + '</dc:creator><cp:lastModifiedBy>' + creator + '</cp:lastModifiedBy><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">'
			+ date + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + date + '</dcterms:modified></cp:coreProperties>');
		//docProps.file('core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><cp:lastModifiedBy>Adam Long</cp:lastModifiedBy><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">2015-01-25T15:18:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2015-01-25T15:19:00Z</dcterms:modified></cp:coreProperties>');


		// docProps/app.xml
		docProps.file('app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Template>Normal.dotm</Template><TotalTime>1</TotalTime><Pages>1</Pages><Words>1</Words><Characters>'
			+ stats.characters + '</Characters><Application>Hemingway</Application><DocSecurity>0</DocSecurity><Lines>1</Lines><Paragraphs>'
			+ stats.paragraphs + '</Paragraphs><ScaleCrop>false</ScaleCrop><Company>Microsoft Corporation</Company><LinksUpToDate>false</LinksUpToDate><CharactersWithSpaces>'
			+ stats.charactersWithSpaces + '</CharactersWithSpaces><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>');
		//docProps.file('app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Template>Normal.dotm</Template><TotalTime>11</TotalTime><Pages>1</Pages><Words>110</Words><Characters>627</Characters><Application>Microsoft Macintosh Word</Application><DocSecurity>0</DocSecurity><Lines>5</Lines><Paragraphs>1</Paragraphs><ScaleCrop>false</ScaleCrop><Company>Hemingway</Company><LinksUpToDate>false</LinksUpToDate><CharactersWithSpaces>736</CharactersWithSpaces><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>14.0000</AppVersion></Properties>');
			//
		var tempFile = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mo="http://schemas.microsoft.com/office/mac/office/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">'
			+ xmlString + '<w:sectPr w:rsidR="00934751"><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="720"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>';

		word.file('document.xml', tempFile);

		var result = zip.generate( {compression: 'DEFLATE'} ); //base64 file by default

		return result;
		
	},

	getLinkRels: function() {
		var linkString= "";
		for (var i = 0; i < this.links.length; i++) {
			var link = this.links[i];
			linkString += '<Relationship Id="rId' + link.id + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="' + link.target + '" TargetMode="External"/>';
		};

		return linkString;
	},

	getStats: function(string) {
		var stats = {};
		
		stats.charactersWithSpaces = string.textContent.length;
		stats.characters = string.textContent.replace(/\s/g, '').length;

		return stats;
	}
};