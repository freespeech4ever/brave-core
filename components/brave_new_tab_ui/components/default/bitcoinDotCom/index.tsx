/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import createWidget from '../widget/index'
import * as Styled from './style'
import { StyledTitleTab } from '../widgetTitleTab'
import assetIcons from './assets/icons'
import fiatData from './fiat'
import BitcoinDotComLogo from './assets/logo.png'
import { CaratDownIcon } from 'brave-ui/components/icons'
import { getLocale } from '../../../../common/locale'

interface State {
  selectedAsset: string
  selectedFiat: string
  currentAmount: string
  assetsShowing: boolean
  fiatCurrenciesShowing: boolean
  amountError: boolean
}

interface Props {
  showContent: boolean
  stackPosition: number
  onShowContent: () => void
  onBuyCrypto: () => void
  onInteraction: () => void
}

class BitcoinDotCom extends React.PureComponent<Props, State> {
  private minimumFiatAmount: number = 20
  private fiatCurrencies: Record<string, string> = fiatData
  private assets: Record<string, string> = {
    'BCH': 'Bitcoin Cash',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'LTC': 'Litecoin',
    'XLM': 'Stellar',
    'XRP': 'Ripple'
  }

  constructor (props: Props) {
    super(props)
    this.state = {
      selectedAsset: 'BCH',
      selectedFiat: 'EUR',
      currentAmount: '',
      assetsShowing: false,
      fiatCurrenciesShowing: false,
      amountError: false
    }
  }

  renderTitle () {
    const { showContent } = this.props

    return (
      <Styled.Header>
        <Styled.Title contentShowing={showContent}>
          <Styled.BitcoinDotComIcon>
            <img src={BitcoinDotComLogo} />
          </Styled.BitcoinDotComIcon>
          <Styled.TitleText>
            {'Bitcoin.com'}
          </Styled.TitleText>
        </Styled.Title>
      </Styled.Header>
    )
  }

  toggleAssetsShowing = () => {
    const { assetsShowing } = this.state

    if (!assetsShowing) {
      this.setState({
        fiatCurrenciesShowing: false
      })
    }

    this.setState({
      assetsShowing: !assetsShowing
    })

    this.props.onInteraction()
  }

  setSelectedAsset = (asset: string) => {
    this.setState({
      assetsShowing: false,
      selectedAsset: asset
    })
  }

  setCurrentAmount = (event: any) => {
    const { target } = event
    const { value } = target
    const validation = /^[0-9]+\.?[0-9]?[0-9]?$/

    this.props.onInteraction()

    if (!validation.test(value) && value !== '') {
      event.preventDefault()
      return
    }

    const parsedInput = parseFloat(value)
    this.setState({
      currentAmount: value,
      amountError: (parsedInput < this.minimumFiatAmount)
    })
  }

  toggleFiatCurrenciesShowing = () => {
    const { fiatCurrenciesShowing } = this.state

    if (!fiatCurrenciesShowing) {
      this.setState({
        assetsShowing: false
      })
    }

    this.setState({
      fiatCurrenciesShowing: !fiatCurrenciesShowing
    })

    this.props.onInteraction()
  }

  setSelectedFiat = (fiat: string) => {
    this.setState({
      fiatCurrenciesShowing: false,
      selectedFiat: fiat
    })
  }

  hideFiatCurrencyOptions = () => {
    this.setState({
      fiatCurrenciesShowing: false
    })
  }

  openBuyURL = () => {
    const {
      currentAmount,
      selectedAsset,
      selectedFiat
    } = this.state

    const amount = currentAmount.trim()
    const asset = selectedAsset.toLowerCase()
    const fiat = selectedFiat.toLowerCase()

    window.open(`https://bitcoincom.moonpay.io/?currencyCode=${asset}&baseCurrencyCode=${fiat}&baseCurrencyAmount=${amount}`, '_blank', 'noopener')
    this.props.onBuyCrypto()
  }

  openInfoURL = () => {
    window.open('https://bitcoincom.moonpay.io/', '_blank', 'noopener')
    this.props.onInteraction()
  }

  renderCurrencyInput () {
    const { assetsShowing, selectedAsset } = this.state

    return (
      <>
        <Styled.InputHeader>
          <Styled.InputLabel>
            {getLocale('bitcoinDotComWidgetCurrency')}
          </Styled.InputLabel>
        </Styled.InputHeader>
        <Styled.Dropdown
          dropdownShowing={assetsShowing}
          onClick={this.toggleAssetsShowing}
        >
          <Styled.AssetItem>
            <Styled.AssetImage src={assetIcons[selectedAsset]} />
            <Styled.AssetTitle>
              {this.assets[selectedAsset]}
            </Styled.AssetTitle>
            <Styled.AssetSymbol>
              {selectedAsset}
            </Styled.AssetSymbol>
          </Styled.AssetItem>
          <Styled.DropdownIcon>
            <CaratDownIcon />
          </Styled.DropdownIcon>
        </Styled.Dropdown>
        {assetsShowing && this.renderCurrencyItems()}
      </>
    )
  }

  renderCurrencyItems () {
    const { selectedAsset } = this.state

    return (
      <Styled.CurrencyItems>
        {Object.keys(this.assets).map((asset: string) => {
          if (asset === selectedAsset) {
            return null
          }

          return (
            <Styled.AssetItem
              key={`${asset}-item`}
              onClick={this.setSelectedAsset.bind(this, asset)}
            >
              <Styled.AssetImage src={assetIcons[asset]} />
              <Styled.AssetTitle>
                {this.assets[asset]}
              </Styled.AssetTitle>
              <Styled.AssetSymbol dropdownShowing={true}>
                {asset}
              </Styled.AssetSymbol>
            </Styled.AssetItem>
          )
        })}
      </Styled.CurrencyItems>
    )
  }

  renderAmountInputError () {
    const { selectedFiat } = this.state

    return (
      <Styled.AmountErrorWrapper>
        <Styled.AmountErrorLabel>
          {getLocale('bitcoinDotComAmountError', {
            fiat: selectedFiat,
            minimumAmount: this.minimumFiatAmount.toString()
          })}
        </Styled.AmountErrorLabel>
      </Styled.AmountErrorWrapper>
    )
  }

  renderAmountInput () {
    const {
      amountError,
      currentAmount,
      fiatCurrenciesShowing,
      selectedFiat
    } = this.state

    return (
      <>
        <Styled.InputHeader>
          <Styled.InputLabel>
            {getLocale('bitcoinDotComWidgetAmount')}
          </Styled.InputLabel>
        </Styled.InputHeader>
        <Styled.AmountInputWrapper>
          <Styled.AmountInput
            type={'text'}
            error={amountError}
            value={currentAmount}
            onChange={this.setCurrentAmount}
            dropdownShowing={fiatCurrenciesShowing}
            onClick={this.hideFiatCurrencyOptions}
            placeholder={getLocale('bitcoinDotComWidgetEnterAmount')}
          />
          <Styled.FiatDropdown
            error={amountError}
            dropdownShowing={fiatCurrenciesShowing}
            onClick={this.toggleFiatCurrenciesShowing}
          >
            <Styled.FiatLabel>
              {selectedFiat}
            </Styled.FiatLabel>
            <Styled.DropdownIcon isFiat={true}>
              <CaratDownIcon />
            </Styled.DropdownIcon>
          </Styled.FiatDropdown>
          {amountError && this.renderAmountInputError()}
          {fiatCurrenciesShowing && this.renderFiatItems()}
        </Styled.AmountInputWrapper>
      </>
    )
  }

  renderFiatItems () {
    const { selectedFiat } = this.state

    return (
      <Styled.FiatItems>
        {Object.keys(this.fiatCurrencies).map((fiat: string) => {
          if (fiat === selectedFiat) {
            return null
          }

          return (
            <Styled.FiatItem
              key={`${fiat}-fiat`}
              onClick={this.setSelectedFiat.bind(this, fiat)}
            >
              <Styled.FiatSymbol>
                {fiat}
              </Styled.FiatSymbol>
              <Styled.FiatName>
                {this.fiatCurrencies[fiat]}
              </Styled.FiatName>
            </Styled.FiatItem>
          )
        })}
      </Styled.FiatItems>
    )
  }

  renderFooter () {
    const { amountError, currentAmount } = this.state
    const buyDisabled = amountError || !currentAmount.trim().length

    return (
      <Styled.FooterWrapper>
        <Styled.BuyButton disabled={buyDisabled} onClick={this.openBuyURL}>
          {getLocale('bitcoinDotComWidgetBuy')}
        </Styled.BuyButton>
        <Styled.FooterInfo>
          <Styled.LinkLabel>
            {getLocale('bitcoinDotComWidgetFooterCopyOne')}
          </Styled.LinkLabel>
          <Styled.Link onClick={this.openInfoURL}>
            {getLocale('bitcoinDotComWidgetFooterCopyTwo')}
          </Styled.Link>
        </Styled.FooterInfo>
      </Styled.FooterWrapper>
    )
  }

  renderTitleTab () {
    const { onShowContent, stackPosition } = this.props

    return (
      <StyledTitleTab onClick={onShowContent} stackPosition={stackPosition}>
        {this.renderTitle()}
      </StyledTitleTab>
    )
  }

  render () {
    if (!this.props.showContent) {
      return this.renderTitleTab()
    }

    return (
      <Styled.WidgetWrapper tabIndex={0}>
        {this.renderTitle()}
        {this.renderCurrencyInput()}
        {this.renderAmountInput()}
        {this.renderFooter()}
      </Styled.WidgetWrapper>
    )
  }
}

export const BitcoinDotComWidget = createWidget(BitcoinDotCom)
