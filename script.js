      let score = 0;
        let timeLeft = 45;
        let gameActive = false;
        let moleInterval;
        let timerInterval;
        let bestScores = {
            easy: 0,
            medium: 0,
            hard: 0
        };
        let currentDifficulty = 'easy';

        const difficulties = {
            easy: {
                time: 45,
                moleSpeed: 1800,
                moleShowTime: 1500,
                label: 'Time: 45s | Speed: Slow'
            },
            medium: {
                time: 30,
                moleSpeed: 1200,
                moleShowTime: 1000,
                label: 'Time: 30s | Speed: Medium'
            },
            hard: {
                time: 25,
                moleSpeed: 800,
                moleShowTime: 700,
                label: 'Time: 25s | Speed: Fast'
            }
        };

        const scoreEl = document.getElementById('score');
        const timerEl = document.getElementById('timer');
        const bestEl = document.getElementById('best');
        const startBtn = document.getElementById('startBtn');
        const gameOverEl = document.getElementById('gameOver');
        const difficultyInfoEl = document.getElementById('difficultyInfo');
        const moles = document.querySelectorAll('.mole');
        const holes = document.querySelectorAll('.hole');
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');

        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (gameActive) return;
                
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentDifficulty = btn.dataset.level;
                
                difficultyInfoEl.textContent = difficulties[currentDifficulty].label;
                timerEl.textContent = difficulties[currentDifficulty].time;
                bestEl.textContent = bestScores[currentDifficulty];
            });
        });

        holes.forEach((hole, index) => {
            hole.addEventListener('click', () => whackMole(index));
        });

        startBtn.addEventListener('click', startGame);

        function startGame() {
            score = 0;
            timeLeft = difficulties[currentDifficulty].time;
            gameActive = true;
            scoreEl.textContent = score;
            timerEl.textContent = timeLeft;
            startBtn.disabled = true;
            gameOverEl.classList.remove('show');

            difficultyBtns.forEach(btn => btn.disabled = true);

            moles.forEach(mole => {
                mole.classList.remove('show', 'whacked');
            });

            moleInterval = setInterval(showRandomMole, difficulties[currentDifficulty].moleSpeed);
            timerInterval = setInterval(updateTimer, 1000);
        }

        function showRandomMole() {
            if (!gameActive) return;

            moles.forEach(mole => {
                mole.classList.remove('show', 'whacked');
            });

            const randomIndex = Math.floor(Math.random() * moles.length);
            moles[randomIndex].classList.add('show');

            setTimeout(() => {
                moles[randomIndex].classList.remove('show');
            }, difficulties[currentDifficulty].moleShowTime);
        }

        function whackMole(index) {
            if (!gameActive) return;
            
            const mole = moles[index];
            if (mole.classList.contains('show') && !mole.classList.contains('whacked')) {
                mole.classList.add('whacked');
                score++;
                scoreEl.textContent = score;
                
                setTimeout(() => {
                    mole.classList.remove('show', 'whacked');
                }, 200);
            }
        }

        function updateTimer() {
            timeLeft--;
            timerEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }

        function endGame() {
            gameActive = false;
            clearInterval(moleInterval);
            clearInterval(timerInterval);
            startBtn.disabled = false;

            difficultyBtns.forEach(btn => btn.disabled = false);

            moles.forEach(mole => {
                mole.classList.remove('show', 'whacked');
            });

            if (score > bestScores[currentDifficulty]) {
                bestScores[currentDifficulty] = score;
                bestEl.textContent = bestScores[currentDifficulty];
                gameOverEl.textContent = `🎉 New Best Score (${currentDifficulty.toUpperCase()}): ${score}! 🎉`;
            } else {
                gameOverEl.textContent = `Game Over! Final Score: ${score}`;
            }
            
            gameOverEl.classList.add('show');
        }