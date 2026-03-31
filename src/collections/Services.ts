import type { CollectionConfig } from 'payload'
import { revalidateService } from './Services/hooks/revalidateService'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'location', 'featuredExplore'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateService],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Restaurants', value: 'restaurants' },
        { label: 'Taxi', value: 'taxi' },
        { label: 'Boats', value: 'boats' },
        { label: 'Excursions', value: 'excursions' },
        { label: 'Rent a Car', value: 'rent-a-car' },
        { label: 'Accommodations', value: 'accommodations' },
        { label: 'Shops', value: 'shops' },
        { label: 'Cretan Groups', value: 'cretan-groups' },
      ],
    },
    {
      name: 'contact',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'airbnb',
      type: 'text',
    },
    {
      name: 'location',
      type: 'select',
      options: [
        { label: 'Heraklion', value: 'heraklion' },
        { label: 'Chania', value: 'chania' },
        { label: 'Rethymno', value: 'rethymno' },
        { label: 'Agios Nikolaos', value: 'agios-nikolaos' },
        { label: 'Elounda', value: 'elounda' },
        { label: 'Agia Pelagia', value: 'agia-pelagia' },
        { label: 'Malia', value: 'malia' },
        { label: 'Hersonissos', value: 'hersonissos' },
        { label: 'Platanias', value: 'platanias' },
        { label: 'Kissamos', value: 'kissamos' },
        { label: 'Sitia', value: 'sitia' },
        { label: 'Ierapetra', value: 'ierapetra' },
        { label: 'Mires', value: 'mires' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'flag',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Special flag for highlighting',
      },
    },
    {
      name: 'featuredExplore',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show in the Explore Crete section on homepage',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
