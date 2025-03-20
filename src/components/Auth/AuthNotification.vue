<template>
  <div class="notification">
    <div class="notification__image">
      <img src="@/assets/img/decor/auth-notification-delay.svg" alt="notification image" />
    </div>

    <div class="notification__body">
      <div class="notification__title h1-title">
        <span>Ограничения с 1 по 5 мая</span>
      </div>
      <p class="text-m">
        Уважаемые клиенты, напоминаем что в период с 1 по 5 мая техническая поддержка работает в
        ограниченном режиме. Ваши обращения регистрируются автоматически, но будут обработаны только
        в первый рабочий день.
      </p>
      <p class="text-m">Поздравляем с наступающими праздниками!</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  max-width: 600px;
  margin: 0px 0;
  padding: 0 20px 0px 40px;
  &__image {
    text-align: center;
    font-size: 0;
    img {
      transform: translateX(-5%);
    }
  }
  &__body {
    margin-top: 28px;
  }
  &__title {
    position: relative;
    margin-bottom: 28px;
    &::before {
      display: inline-block;
      content: ' ';
      width: 50px;
      height: 50px;
      position: absolute;
      z-index: 1;
      top: -5px;
      left: -16px;
      background: #b1dcff;
    }
    span {
      position: relative;
      z-index: 2;
    }
  }
}

@include r($md) {
  .notification {
    margin-top: 64px;
    margin-left: auto;
    margin-right: auto;
    &__body {
      margin-top: 42px;
    }
  }
}
</style>
