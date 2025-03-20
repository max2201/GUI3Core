export enum ChangedDialogReasonTypes {
    None                        =   0,
    /// <summary>
    /// Диалог начат
    /// </summary>
    Started                     =   1,
    /// <summary>
    /// Диалог завершен
    /// </summary>
    Finished                    =   2,
    /// <summary>
    /// Диалог освобожден
    /// </summary>
    Released                    =   3,
    /// <summary>
    /// Диалог НЕ начат по неизвестной причине
    /// </summary>
    NonStartedUnlnown           =   4,
    /// <summary>
    /// Диалог НЕ начат, потому-что принадлежит другому пользователю
    /// </summary>
    NonStartedOtherUser         =   5,
    /// <summary>
    /// Диалог НЕ начат, потому-что УЖЕ принадлежит данному пользователю
    /// </summary>
    NonStartedCurrentUser       =   6,
    /// <summary>
    /// Диалог не может быть завершен т.к. не принадлежит текущему пользователю
    /// </summary>
    NonFinishedByCurrentUser    =   7,
    /// <summary>
    /// У диалога были изменены какие-либо свойства (например, код связанного договора)
    /// </summary>
    Updated                     =   8,
    /// <summary>
    /// Не удалось забрать диалог, т.к. он уже завершен
    /// </summary>
    NonTakeButFinished          =   9,
    /// <summary>
    /// Диалог был успешно забран
    /// </summary>
    Taken                       =   10,
    /// <summary>
    /// Диалог был удален т.к. оказался пустым
    /// </summary>
    RemoveAsEmpty               =   11
}