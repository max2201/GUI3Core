<template>
  <div class="client-page client-main-page">
    <ClientInfoRow v-if="objectData" :client-id="-1" name="Новый клиент" :phones="[]" />

    <div class="client-main-page__middle-section">
      <div class="client-main-page__middle-section__left">
        <div class="about-column">
          <div class="client-foto">
            <div class="client-foto-content"></div>
          </div>
          <div class="disable-client-deal">
            <SvgIcon name="forbidden-circle" />
            <span>Запрет на заключение договора</span>
          </div>

          <div class="documents-for-print">
            <h3>Документы для печати</h3>
            <InlineFileInfo label="Анкета клиента" />
            <InlineFileInfo label="ДКП-ФинАренда-Поручитель АБ Юч" />
            <InlineFileInfo label="Договор комиссии" />
          </div>
        </div>
      </div>

      <div class="client-main-page__middle-section__right">
        <div class="main__stats">
          <div class="stats-item">
            <div class="stats-item__label">Текущий баланс</div>
            <div class="stats-item__value stats-item__value_danger">300 000</div>
            <div class="stats-item__mark stats-item__mark_danger" />
          </div>

          <div class="stats-item">
            <div class="stats-item__label">Задолженность</div>
            <div class="stats-item__value stats-item__value_danger">-8500</div>
            <div class="stats-item__mark stats-item__mark_danger" />
          </div>

          <div class="stats-item">
            <div class="stats-item__label">Лицевой счет</div>
            <div class="stats-item__value">1200 / 4500</div>
            <div class="stats-item__mark" />
          </div>

          <div class="stats-item">
            <div class="stats-item__label">Скидка/бонус</div>
            <div class="stats-item__value">3% / -</div>
            <div class="stats-item__mark" />
          </div>
        </div>

        <div class="main__contacts">
          <div>
            <h3 class="mb-3">Основные данные</h3>
            <LiteViewField :field="{ Title: 'Категория', Value: 'Сотрудник' }" />
            <LiteViewField :field="{ Title: 'Роль контрагента', Value: 'Клиент, Поставщик' }" />
            <LiteViewField :field="{ Title: 'Кодовое слово', Value: 'не задано' }" />
            <LiteViewField :field="{ Title: 'ЭЦП', Value: 'Дата подписания 02.09.2024' }" />
          </div>
          <div>
            <h3 class="mb-3">Получение уведомлений</h3>
            <LiteViewField :field="{ Title: 'Уведомления', Value: 'подключены' }" />
            <LiteViewField :field="{ Title: 'Реклама', Value: 'отключена' }" />
            <LiteViewField :field="{ Title: 'Телефон', Value: '+7 963 320 32 32' }" />
          </div>
        </div>

        <div class="main__entities">
          <div class="entity-card">
            <h3 class="entity-card__label mb-3">Договора</h3>
            <div class="entity-card__stats mb-2">
              <div class="entity-card__stat">
                <div class="entity-card__stat__label mb-1">всего</div>
                <div class="entity-card__stat__count">
                  <SvgIcon :width="20" :height="20" name="text" /> 2
                </div>
              </div>

              <div class="entity-card__stat">
                <div class="entity-card__stat__label mb-1">открыто</div>
                <div class="entity-card__stat__count">
                  <SvgIcon :width="20" :height="20" name="text" /> 2
                </div>
              </div>
            </div>
            <div class="entity-card__info">
              Последний договор <SvgIcon :width="11" :height="11" name="open-here" />
            </div>
          </div>

          <div class="entity-card">
            <h3 class="entity-card__label mb-3">Звонки</h3>
            <div class="entity-card__stats mb-2">
              <div class="entity-card__stat">
                <div class="entity-card__stat__label mb-1">всего</div>
                <div class="entity-card__stat__count">
                  <SvgIcon :width="20" :height="20" name="text" /> 2
                </div>
              </div>

              <div class="entity-card__stat">
                <div class="entity-card__stat__label mb-1">открыто</div>
                <div class="entity-card__stat__count">
                  <SvgIcon :width="20" :height="20" name="text" /> 2
                </div>
              </div>
            </div>
            <div class="entity-card__info">
              Последний договор <SvgIcon :width="11" :height="11" name="open-here" />
            </div>
          </div>

          <div class="entity-card">
            <h3 class="entity-card__label mb-3">Заявки</h3>
            <div class="entity-card__stats mb-2">
              <div class="entity-card__stat">
                <div class="entity-card__stat__label mb-1">всего</div>
                <div class="entity-card__stat__count">
                  <SvgIcon :width="20" :height="20" name="text" /> 2
                </div>
              </div>

              <div class="entity-card__stat">
                <div class="entity-card__stat__label mb-1">открыто</div>
                <div class="entity-card__stat__count">
                  <SvgIcon :width="20" :height="20" name="text" /> 2
                </div>
              </div>
            </div>
            <div class="entity-card__info">
              Последний договор <SvgIcon :width="11" :height="11" name="open-here" />
            </div>
          </div>

          <div class="entity-card">
            <h3 class="entity-card__label mb-3">Диалогов</h3>
            <div class="entity-card__stats mb-2">
              <div class="entity-card__stat">
                <div class="entity-card__stat__label mb-1">всего</div>
                <div class="entity-card__stat__count">
                  <SvgIcon :width="20" :height="20" name="text" /> 2
                </div>
              </div>

              <div class="entity-card__stat">
                <div class="entity-card__stat__label mb-1">открыто</div>
                <div class="entity-card__stat__count">
                  <SvgIcon :width="20" :height="20" name="text" /> 2
                </div>
              </div>
            </div>
            <div class="entity-card__info">
              Последний договор <SvgIcon :width="11" :height="11" name="open-here" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="client-main-page__actions"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import './clientPages.scss';
.client-page {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 60px;
  overflow: hidden;
}

.client-main-page__actions {
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 30px;

  button:not(:last-child) {
    margin-right: 8px;
  }
}

.client-main-page__middle-section {
  display: grid;
  grid-template-columns: 300px auto;
  grid-template-rows: 1fr;
  overflow: hidden;
}
.client-main-page__middle-section__left {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  overflow: hidden;
}

.client-main-page__middle-section__right {
  overflow-x: hidden;
  overflow-y: auto;
}

.about-column,
.info-panel {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.about-column {
  border-right: var(--border-default);
  padding: 20px 23px;
  gap: 20px;
}

.client-foto {
  display: block;
  background-color: darkturquoise;
  width: 252px;
  height: 160px;
}
.disable-client-deal {
  display: flex;
  gap: 6px;
  align-items: center;
  height: 32px;
  background-color: var(--component-danger-background);
  padding: 6px 0 6px 6px;
  border-radius: 5px;
  overflow: hidden;

  > svg {
    color: var(--component-danger);
  }
}
.short-info {
  display: flex;
  flex-direction: column;
  gap: 3px;

  &__error {
    font-size: var(--font-size-standart);
    color: var(--color-red);
  }
}
.short-info__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.short-info__header__title {
  color: var(--color-gray);
}
.short-info__body {
}
.documents-for-print {
  display: flex;
  flex-direction: column;
  width: 253px;
  gap: 12px;
}
</style>
