<template>
    <!-- Trending Songs -->
    <div style="margin-bottom: 10rem; margin-top: 3rem; width: 100%;">
        <div style="margin-bottom: 20px;border-bottom: 1px solid var(--secondary);">
            <h2 style="margin-bottom: 10px;">Recommended Songs</h2>
        </div>
        <div style="margin-bottom: 15px; width: 100%;">
            <div class="cards" style="display: flex; justify-content: space-around; align-items: center;">
                <div class="card">
                    <img src="https://pbs.twimg.com/media/Fzj1ehKaYAEp6ze?format=jpg&name=4096x4096"
                        style="border-radius: 3%;width: 100%; height: 9rem; margin-bottom: 10px;">
                    <div style="width: 100%;">
                        <h3>Vampire</h3>
                        <h5>Olivia Rodrigo</h5>
                    </div>
                </div>
                <div class="card">
                    <img src="https://i.ytimg.com/vi/Iq8h3GEe22o/mqdefault.jpg"
                        style="border-radius: 3%;width: 100%; height: 9rem; margin-bottom: 10px;">
                    <div style="width: 100%;">
                        <h3>Loving On Me</h3>
                        <h5>Jack Harlow</h5>
                    </div>
                </div>
                <div class="card">
                    <img src="https://upload.wikimedia.org/wikipedia/en/7/7d/Tate_McRae_-_Greedy.png"
                        style="border-radius: 3%;width: 100%; height: 9rem; margin-bottom: 10px;">
                    <div style="width: 100%;">
                        <h3>Greedy</h3>
                        <h5>Tate Mcrae</h5>
                    </div>
                </div>
                <div class="card">
                    <img src="https://m.media-amazon.com/images/M/MV5BNDAzYjUzMTEtZDk3YS00OGY1LTgyNTQtNmMzNzg5MTM0NGFjXkEyXkFqcGdeQXVyNDYzNDg2MTM@._V1_FMjpg_UX1000_.jpg"
                        style="border-radius: 3%;width: 100%; height: 9rem; margin-bottom: 10px;">
                    <div style="width: 100%;">
                        <h3>Seven</h3>
                        <h5>Jungkook</h5>
                    </div>
                </div>
                <div class="card">
                    <img src="https://i.scdn.co/image/ab67616d0000b2734756c2e9ae436437cd75e9f3"
                        style="border-radius: 3%;width: 100%; height: 9rem; margin-bottom: 10px;">
                    <div style="width: 100%;">
                        <h3>Strangers</h3>
                        <h5>Kenya Grace</h5>
                    </div>
                </div>
                <div class="card">
                    <img src="https://images.squarespace-cdn.com/content/v1/6091d047f84a401eacaf886f/c212db64-89de-4fe5-bea4-6292141a769e/1200x1200bf-60.jpg"
                        style="border-radius: 3%;width: 100%; height: 9rem; margin-bottom: 10px;">
                    <div style="width: 100%;">
                        <h3>Rush</h3>
                        <h5>Troye Sivan</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.card {
    background-color: white;
    border-radius: 3%;
    margin-right: 20px;
    width: 14%;
    padding: 15px;
    transition: background-color 0.3s;
}
.card:hover{
    background-color: rgb(214, 255, 186);
}
</style>