/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect, useState} from 'react'
import '@testing-library/jest-dom'
import {screen, waitFor} from '@testing-library/react'

import {recordHookResponses, renderWithProviders} from '../test-utils'
import useCommerceApi from './useCommerceApi'

// TODO: uninstall `msw`

// TODO: iterate
const nockBack = recordHookResponses()

test('useCommerceApi', async () => {
    const {nockDone} = await nockBack('use-commerce-api.json')

    const Component = () => {
        const api = useCommerceApi()
        const [productName, setProductName] = useState('')

        useEffect(() => {
            const fetchProductName = async () => {
                const product = await api.shopperProducts.getProduct({
                    parameters: {id: '25591862M'}
                })
                setProductName(product.name as string)
            }
            fetchProductName()
        }, [])

        return <div>{productName}</div>
    }
    // This util function would automatically integrate the provider components for you
    renderWithProviders(<Component />)

    const productName = 'Stripe Walking Short'
    await waitFor(() => screen.getByText(productName))

    expect(screen.getByText(productName)).toBeInTheDocument()

    nockDone()
})
