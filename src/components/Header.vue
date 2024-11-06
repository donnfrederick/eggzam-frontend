<script setup lang="ts">
</script>

<template>
    <div class="header d-flex align-items-center justify-content-between">
        <h1 class="fw-normal">Task Management</h1>
        <div class="avatar">
            <div class="d-flex align-items-center">
                <i class="fa fa-user-circle" style="font-size: 260%;"></i>
                <span class="fw-normal" style="margin-left: 1rem;font-size: 120%;">Administrator</span>
            </div>
        </div>
    </div>
    <div class="navigation">
        <div class="avatar d-flex justify-content-center align-items-center">
            <i class="fa fa-user-circle" style="font-size: 260%;"></i>
            <span class="fw-normal" style="margin-left: 1rem;font-size: 120%;">Administrator</span>
        </div>
        <ul>
            <li>
                <a href="#"><i class="fa fa-list-check"></i> Tasks</a>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.header {
    width: 100%;
    padding: 1rem 2rem;
    background: #191C24;
    position: fixed;
    z-index: 2;
    box-shadow: 0rem 0rem 20rem 20px #2b2b2b;
}
.navigation {
    position: fixed;
    height: 100%;
    width: 18%;
    left: 0;
    top: 0;
    background: #191C24;
    z-index: 1;
    padding-top: 6rem;
}
.navigation .avatar {
    margin: 2rem auto;
}
.navigation ul {
    padding: 0;
    margin: 3rem 0 0 0;
}
.navigation ul li {
    list-style: none;
}
.navigation ul li a {
    text-decoration: none;
    width: 100%;
    display: block;
    padding: 0.5rem 1.5rem;
    background-color: #6C7293;
    color: #191C24;
    font-weight: bold;
    font-size: 17px;
}
@media only screen and (max-width: 1250px) {
    .header h1 {
        text-align: center;
    }
    .header .avatar {
        display: none;
    }
    .navigation {
        display: none;
    }
}
</style>