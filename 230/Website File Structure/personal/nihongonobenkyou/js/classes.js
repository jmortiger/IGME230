
class VerbInfo {
	constructor(hiraganaSpelling, kanjiSpelling, shortMeaning, longDescription, isRuVerb = false) {
		this.hiraganaSpelling = hiraganaSpelling;
		this.kanjiSpelling = kanjiSpelling;
		this.shortMeaning = shortMeaning;
		this.longDescription = longDescription;
		this.isRuVerb = isRuVerb;
	}

	getConjugation(form, tense, isPositive = true) {
		form = form.toLowercase();
		tense = tense.toLowercase();
		if (form == "short" || form == "casual") {
			if (tense == "present")
				;
		}
		else if (form == "long" || form == "formal") {

		}
		else if (form == "te") {

		}
	}
}
