/* ============================================================
   project.js — F1 Made Simple
   JavaScript for: alert banner, jQuery slideshow,
   interactive quiz, form validation, glossary search
   ============================================================ */

/* ===== ALERT BANNER (index.html) =====
   Dismisses the red announcement bar at the top of the page. */
(function () {
    var btn = document.getElementById('dismiss-alert');
    if (!btn) return;
    btn.addEventListener('click', function () {
        document.getElementById('alert-banner').style.display = 'none';
    });
})();

/* ===== JQUERY SLIDESHOW (index.html) =====
   Auto-advances every 4 s; prev/next buttons and dot indicators
   allow manual navigation. */
if (typeof jQuery !== 'undefined') {
    jQuery(function ($) {
        var $slides = $('.slide');
        var $dots   = $('.dot');
        var current = 0;
        var timer;

        if (!$slides.length) return;

        function goTo(index) {
            $slides.eq(current).removeClass('active');
            $dots.eq(current).removeClass('active');
            current = ((index % $slides.length) + $slides.length) % $slides.length;
            $slides.eq(current).addClass('active');
            $dots.eq(current).addClass('active');
        }

        function startAuto() { timer = setInterval(function () { goTo(current + 1); }, 4000); }
        function resetAuto() { clearInterval(timer); startAuto(); }

        $('#slider-prev').on('click', function () { goTo(current - 1); resetAuto(); });
        $('#slider-next').on('click', function () { goTo(current + 1); resetAuto(); });
        $dots.on('click',             function () { goTo($(this).index()); resetAuto(); });

        startAuto();
    });
}

/* ===== INTERACTIVE QUIZ (quiz.html) =====
   Grades all 10 questions, highlights correct/incorrect options,
   shows per-question feedback and a final score box.
   Uses window.alert() if the user tries to submit with unanswered questions. */
(function () {
    var submitBtn = document.getElementById('submit-quiz');
    if (!submitBtn) return;

    var answers = {
        q1: 'B', q2: 'C', q3: 'D', q4: 'B', q5: 'C',
        q6: 'C', q7: 'C', q8: 'B', q9: 'C', q10: 'D'
    };

    var explanations = {
        q1:  'The 2026 grid has 11 teams and 22 drivers, including new entrant Cadillac.',
        q2:  'Cadillac is the newest constructor — the first new team since Haas in 2016.',
        q3:  'The 2026 calendar runs 24 Grands Prix, from Australia in March to Abu Dhabi in December.',
        q4:  'DRS was replaced by Active Aerodynamics (Corner/Straight Mode) and Overtake Mode.',
        q5:  'With 22 cars on the grid, 6 drivers are eliminated in Q1 (previously 5).',
        q6:  'Q3 was extended from 12 to 13 minutes to give the top 10 drivers adequate time.',
        q7:  'Six Sprint weekends: China, Miami, Canada, Great Britain, Netherlands, and Singapore.',
        q8:  'The MGU-H was removed for 2026 due to cost, complexity, and low road relevance.',
        q9:  'The MGU-K was tripled from 120 kW to 350 kW, making the power unit roughly 50% electric.',
        q10: 'Lando Norris won his first championship in 2025 driving for McLaren-Mercedes.'
    };

    submitBtn.addEventListener('click', function () {
        var unanswered = [];
        for (var q in answers) {
            if (!document.querySelector('input[name="' + q + '"]:checked')) {
                unanswered.push(q.replace('q', ''));
            }
        }
        if (unanswered.length > 0) {
            alert('Please answer all 10 questions before checking your score.\n\nUnanswered: Question ' + unanswered.join(', '));
            return;
        }

        var score = 0;
        for (var q in answers) {
            var selected = document.querySelector('input[name="' + q + '"]:checked').value;
            var correct  = answers[q];
            var num      = q.replace('q', '');
            var feedback = document.getElementById('feedback-' + num);

            document.querySelectorAll('input[name="' + q + '"]').forEach(function (radio) {
                radio.disabled = true;
                var lbl = radio.closest('label');
                if (radio.value === correct) {
                    lbl.style.backgroundColor = '#d4edda';
                    lbl.style.borderColor     = '#28a745';
                } else if (radio.checked) {
                    lbl.style.backgroundColor = '#f8d7da';
                    lbl.style.borderColor     = '#dc3545';
                }
            });

            if (selected === correct) {
                score++;
                feedback.textContent = 'Correct! ' + explanations[q];
                feedback.className   = 'question-feedback correct';
            } else {
                feedback.textContent = 'Incorrect — the answer is ' + correct + '. ' + explanations[q];
                feedback.className   = 'question-feedback incorrect';
            }
        }

        var msg = score === 10 ? 'Perfect score! You really know your F1!' :
                  score >= 8  ? 'Great job! You know your 2026 F1 facts.' :
                  score >= 6  ? 'Good effort! Review the sections you missed.' :
                  score >= 4  ? 'Keep studying — use the Study Up links in the sidebar.' :
                                'No worries! Explore the site to learn more about F1.';

        document.getElementById('score-num').textContent = score + ' / 10';
        document.getElementById('score-msg').textContent = msg;
        var scoreBox = document.getElementById('quiz-score');
        scoreBox.style.display = 'block';
        scoreBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        document.getElementById('answer-key').style.display = 'block';

        submitBtn.disabled      = true;
        submitBtn.textContent   = 'Quiz Submitted';
        submitBtn.style.opacity = '0.6';
    });
})();

/* ===== FORM VALIDATION (quiz.html) =====
   Shows inline error messages and blocks submission when
   name, email, or message fields are empty or invalid. */
(function () {
    var form = document.querySelector('.quiz-form form');
    if (!form) return;

    function showError(fieldId, errorId, msg) {
        var field = document.getElementById(fieldId);
        var err   = document.getElementById(errorId);
        field.classList.add('invalid');
        err.textContent   = msg;
        err.style.display = 'block';
    }

    function clearError(fieldId, errorId) {
        var field = document.getElementById(fieldId);
        var err   = document.getElementById(errorId);
        field.classList.remove('invalid');
        err.style.display = 'none';
    }

    ['name', 'email', 'message'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', function () {
            clearError(id, id + '-error');
        });
    });

    form.addEventListener('submit', function (e) {
        var valid    = true;
        var nameVal  = document.getElementById('name').value.trim();
        var emailVal = document.getElementById('email').value.trim();
        var msgVal   = document.getElementById('message').value.trim();
        var emailRe  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (nameVal.length < 2) {
            showError('name', 'name-error', 'Please enter your name (at least 2 characters).');
            valid = false;
        }
        if (!emailRe.test(emailVal)) {
            showError('email', 'email-error', 'Please enter a valid email address (e.g. you@example.com).');
            valid = false;
        }
        if (msgVal.length < 10) {
            showError('message', 'message-error', 'Please enter your question (at least 10 characters).');
            valid = false;
        }
        if (!valid) e.preventDefault();
    });
})();

