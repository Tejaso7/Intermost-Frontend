'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { Users, Building, Calendar, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 5500,
    suffix: '+',
    label: 'Students Placed',
    description: 'Successfully admitted worldwide',
  },
  {
    icon: Building,
    value: 35,
    suffix: '+',
    label: 'Partner Universities',
    description: 'NMC & WHO approved',
  },
  {
    icon: Calendar,
    value: 21,
    suffix: '+',
    label: 'Years Experience',
    description: 'Trusted since 2003',
  },
  {
    icon: Award,
    value: 99,
    suffix: '%',
    label: 'Visa Success Rate',
    description: 'Industry-leading success',
  },
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Our Achievements
          </span>
          <h2 className="section-title mt-2">
            Numbers That <span className="gradient-text">Speak</span>
          </h2>
          <p className="section-subtitle mt-4">
            Our track record speaks for itself - trusted by thousands of families
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <stat.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
              </div>

              {/* Value */}
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {isInView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                  />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>

              {/* Label */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {stat.label}
              </h3>
              <p className="text-sm text-gray-500">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
