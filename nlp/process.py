from sys import argv
import recurrent
from json import JSONEncoder as encoder

json = encoder().encode

try:
	text_content = ' '.join(argv[1:])
	parsed_result = recurrent.parse(text_content) or None
	friendly_result = recurrent.format(parsed_result) if parsed_result else None

	print(
		json({
			"parameterised": str(parsed_result),
			"friendly": str(friendly_result) if not friendly_result.startswith("RRULE") else None,
		})
	)
	exit(0)
except Exception as ex:
	print(
		json({
			"message": ex.args[0]
		})
	)
	exit(1)
