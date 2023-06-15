import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  exchangeRatesUSD = 0.0;
  exchangeRatesEUR = 0.0;

  currencyForm = this.formBuilder.group({
    left_currency: 'USD',
    right_currency: 'UAH',
    left_value: '0.0',
    right_value: '0.0'
  });

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.convertCurrency("USD", "UAH", "1.0").subscribe((conversion: any) => {
      this.exchangeRatesUSD = conversion["rates"]["UAH"]["rate"];
    });

    this.convertCurrency("EUR", "UAH", "1.0").subscribe((conversion: any) => {
      this.exchangeRatesEUR = conversion["rates"]["UAH"]["rate"];
    });
  }

  onLeftCurrencyChanged() {
    this.updateCurrencies("left");
  }

  onRightCurrencyChanged() {
    this.updateCurrencies("right");
  }

  onLeftValueChanged() {
    this.onValueChanged("left");
  }

  onRightValueChanged() {
    this.onValueChanged("right");
  }

  updateCurrencies(side: string) {
    const oppositeSide = side === "left" ? "right" : "left";

    const sideCurrencyString = `${side}_currency`;
    const oppositeSideCurrencyString = `${oppositeSide}_currency`;

    const sideCurrency = this.currencyForm.value[sideCurrencyString];
    const oppositeSideCurrency = this.currencyForm.value[oppositeSideCurrencyString];

    const sideValueString = `${side}_value`;
    const oppositeSideValueString = `${oppositeSide}_value`;

    const sideValue = this.currencyForm.value[sideValueString];;
    const oppositeSideValue = this.currencyForm.value[oppositeSideValueString];

    if (sideCurrency === oppositeSideCurrency) {
      this.currencyForm.patchValue({ [sideValueString]: oppositeSideValue });
    } else {
      this.convertCurrency(sideCurrency, oppositeSideCurrency, sideValue).subscribe((conversion: any) => {
        this.currencyForm.patchValue({ [oppositeSideValueString]: conversion["rates"][oppositeSideCurrency]["rate_for_amount"] });
      })
    }
  }

  onValueChanged(side: string) {
    const oppositeSide = side === "left" ? "right" : "left";

    const sideCurrencyString = `${side}_currency`;
    const oppositeSideCurrencyString = `${oppositeSide}_currency`;

    const sideCurrency = this.currencyForm.value[sideCurrencyString];
    const oppositeSideCurrency = this.currencyForm.value[oppositeSideCurrencyString];

    const sideValueString = `${side}_value`;
    const oppositeSideValueString = `${oppositeSide}_value`;

    const sideValue = this.currencyForm.value[sideValueString];

    if (sideCurrency === oppositeSideCurrency) {
      this.currencyForm.patchValue({ [oppositeSideValueString]: sideValue });
    } else {
      this.convertCurrency(sideCurrency, oppositeSideCurrency, sideValue).subscribe((conversion: any) => {
        this.currencyForm.patchValue({ [oppositeSideValueString]: conversion["rates"][oppositeSideCurrency]["rate_for_amount"] });
      });
    }
  }

  convertCurrency(from: string, to: string, amount: string) {
    const API_KEY = '431ce88c98be256ce2080a649044bee60020d0e4';
    const CONVERSION = `from=${from}&to=${to}&amount=${amount}&format=json`;
    const request = `https://api.getgeoapi.com/v2/currency/convert?api_key=${API_KEY}&${CONVERSION}`;
    return this.http.get(request);
  }
}
