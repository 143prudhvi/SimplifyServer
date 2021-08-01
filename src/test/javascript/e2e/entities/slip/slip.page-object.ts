import { element, by, ElementFinder } from 'protractor';

export class SlipComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-slip div table .btn-danger'));
  title = element.all(by.css('jhi-slip div h2#page-heading span')).first();
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

export class SlipUpdatePage {
  pageTitle = element(by.id('jhi-slip-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  dateInput = element(by.id('field_date'));
  tbgrInput = element(by.id('field_tbgr'));
  gradeInput = element(by.id('field_grade'));
  lotnoInput = element(by.id('field_lotno'));
  weightInput = element(by.id('field_weight'));
  priceInput = element(by.id('field_price'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async setTbgrInput(tbgr: string): Promise<void> {
    await this.tbgrInput.sendKeys(tbgr);
  }

  async getTbgrInput(): Promise<string> {
    return await this.tbgrInput.getAttribute('value');
  }

  async setGradeInput(grade: string): Promise<void> {
    await this.gradeInput.sendKeys(grade);
  }

  async getGradeInput(): Promise<string> {
    return await this.gradeInput.getAttribute('value');
  }

  async setLotnoInput(lotno: string): Promise<void> {
    await this.lotnoInput.sendKeys(lotno);
  }

  async getLotnoInput(): Promise<string> {
    return await this.lotnoInput.getAttribute('value');
  }

  async setWeightInput(weight: string): Promise<void> {
    await this.weightInput.sendKeys(weight);
  }

  async getWeightInput(): Promise<string> {
    return await this.weightInput.getAttribute('value');
  }

  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getAttribute('value');
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

export class SlipDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-slip-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-slip'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
