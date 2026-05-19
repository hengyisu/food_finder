import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import _extract_spec


def test_extract_spec_returns_spec_when_signal_present():
    response = "[SPEC_READY]\n# My Design\n\n## Overview\nA scraper."
    result = _extract_spec(response)
    assert result == "# My Design\n\n## Overview\nA scraper."


def test_extract_spec_returns_none_when_no_signal():
    response = "這個爬蟲的目標網站有登入需求嗎？"
    result = _extract_spec(response)
    assert result is None


def test_extract_spec_strips_leading_whitespace_after_signal():
    response = "[SPEC_READY]   \n\n# Design\n## Overview\nFoo."
    result = _extract_spec(response)
    assert result == "# Design\n## Overview\nFoo."


def test_extract_spec_signal_embedded_mid_response():
    # [SPEC_READY] must appear; everything after it is the spec
    response = "some preamble [SPEC_READY]\n# Design\n## Overview\nBar."
    result = _extract_spec(response)
    assert result == "# Design\n## Overview\nBar."
