import { element, by, ElementFinder } from 'protractor';

export class TbgrComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-tbgr div table .btn-danger'));
  title = element.all(by.css('jhi-tbgr div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class TbgrUpdatePage {
  pageTitle = element(by.id('jhi-tbgr-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  boardInput = element(by.id('field_board'));
  villageInput = element(by.id('field_village'));
  tbgrInput = element(by.id('field_tbgr'));
  nameInput = element(by.id('field_name'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setBoardInput(board: string): Promise<void> {
    await this.boardInput.sendKeys(board);
  }

  async getBoardInput(): Promise<string> {
    return await this.boardInput.getAttribute('value');
  }

  async setVillageInput(village: string): Promise<void> {
    await this.villageInput.sendKeys(village);
  }

  async getVillageInput(): Promise<string> {
    return await this.villageInput.getAttribute('value');
  }

  async setTbgrInput(tbgr: string): Promise<void> {
    await this.tbgrInput.sendKeys(tbgr);
  }

  async getTbgrInput(): Promise<string> {
    return await this.tbgrInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class TbgrDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-tbgr-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-tbgr'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
