<template>
  <div class="col filter__col">
    <div class="filter__section-title">Мои шаблоны</div>
    <ul class="filter__tpl-list">
      <li>
        <a href="">Неоплачено за сегодня</a>
      </li>
      <li>
        <a href="">Неоплачено за неделю</a>
      </li>
      <li>
        <a href="">Дебиторка</a>
      </li>
      <li>
        <a href="">Дебиторки на сегодня</a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  &__tpl-list {
    margin: 12px 0;
    list-style: none;
    li {
      &:not(:last-child) {
        border-bottom: 1px solid var(--color-border);
      }
    }
    a {
      display: inline-block;
      padding: 15px 0;
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
</style>
